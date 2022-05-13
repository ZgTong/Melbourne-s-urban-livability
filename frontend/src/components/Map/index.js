import React, {memo, useRef, useEffect, useState } from 'react';
import useDeepCompareEffectForMaps from "use-deep-compare-effect";
import { useSelector, useDispatch } from "react-redux";
import { selectVariableRange, selectSelectedTopic, setVariableRange, setSelectedTopic } from '../../store/reducers/selectBar'
import { readyFlagSelector, setReadyFlag, setAppReadyFlag } from '../../store/reducers/map'
import './index.scss';
import mapStyle from "../../asset/map_style";
import { VIC_STATE_BOUNDARIES_JSON_PATH } from "../../utils/constants";
import {GetScene, GetSuburbs} from "../../api";
import useGoogleCharts from "../../utils/useGoogleCharts";
const Map = ({
                style,
                children,
                onClick = (e)=>{
                    console.log("click:", e)},
                onIdle = (e)=>{
                    console.log("idle:", e)},
                ...options
             }) => {
    const range = useSelector(selectVariableRange);
    const readyFlag = useSelector(readyFlagSelector);
    const selectedTopic = useSelector(selectSelectedTopic);
    const dispatch = useDispatch()
    const ref = useRef(null)
    const [zoom, setZoom] = useState(9); // initial zoom
    const [center, setCenter] = useState({
        lat: -37.7998,
        lng: 144.9460,
    });
    const [currentSceneData, setCurrentSceneData] = useState(null);
    const updateSceneDataRef= useRef()
    const googleChart = useGoogleCharts()
    const [map, setMap] = useState(null)
    const [livabilityValMin, setLivabilityValMin] = useState(Number.MAX_VALUE)
    const [livabilityValMax, setLivabilityValMax] = useState(-Number.MAX_VALUE)
    const [infoBox] = useState(new window.google.maps.InfoWindow({content: ''}))
    const drawPieChart = (dataSet, container, title) => {
        const data = new googleChart.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        let rows = []
        for (const item of Object.entries(dataSet)){
            rows.push(item)
        }
        data.addRows(rows);
        let options = {title,
            'width':300,
            'height':250};
        const newChart = new googleChart.visualization.PieChart(container);
        newChart.draw(data, options);
    }
    const mouseInToRegion = (e) => {
        e.feature.setProperty("state", "hover");
        infoBox.setPosition(e.latLng)
        console.log(e.feature.getProperty("livability_variable"))
        if (e.feature.getProperty("livability_variable")){
            const percent =
                ((e.feature.getProperty("livability_variable") - livabilityValMin) /
                    (livabilityValMax - livabilityValMin)) *
                100;
            document.getElementById("data-caret").style.display = "block";
            document.getElementById("data-caret").style.paddingLeft = percent + "%";
            infoBox.setPosition(e.latLng)

            let infoContent = document.createElement('div');
            let locNode = document.createElement('div');
            let scoreNode = document.createElement('div');
            let chartNode = document.createElement('div');
            const chartNodeId = "chartNodeId"
            locNode.setAttribute('class', "fw_bold fz_20")
            scoreNode.setAttribute('class', "fw_bold fz_20")
            chartNode.setAttribute('id', chartNodeId)
            let chartData = {
                neutralMetric: e.feature.getProperty("neutralMetric"),
                positiveMetric: e.feature.getProperty("positiveMetric"),
                negativeMetric: e.feature.getProperty("negativeMetric"),
            }
            drawPieChart(chartData, chartNode, "Pie chart of Twitter sentiment ratio")
            locNode.innerHTML = `Location: <span class="fw_normal">${e.feature.getProperty("vic_lga__2")}</span>`;
            scoreNode.innerHTML = `Total liveability index: <span class="fw_normal">${e.feature.getProperty("livability_variable").toFixed(2)}</span>`;
            infoContent.appendChild(locNode);
            infoContent.appendChild(scoreNode);
            infoContent.appendChild(chartNode);
            infoBox.setContent(infoContent)
            infoBox.open(map)
        }
    }
    const mouseOutOfRegion = (e) => {
        e.feature.setProperty("state", "normal");
        infoBox.close()
    }
    const clickRegion = (e) => {
        infoBox.close()
        // loadSuburbData(e.feature.getProperty("lga_pid"), e.latLng, 11)
    }
    const smoothZoom = (map, max, cnt) => {
        if (cnt >= max) {
            return;
        }
        else {
            let z = window.google.maps.event.addListener(map, 'zoom_changed', function(event){
                window.google.maps.event.removeListener(z);
                smoothZoom(map, max, cnt + 1);
            });
            setTimeout(function(){setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
        }
    }
    const styleFeature = (feature) => {
        let low = [5, 69, 54]; // color of smallest datum
        let high = [151, 83, 34]; // color of largest datum
        let delta =
            (feature.getProperty("livability_variable") - livabilityValMin) /
            (livabilityValMax - livabilityValMin);
        let color = [];
        for (let i = 0; i < 3; i++) {
            color[i] = (high[i] - low[i]) * delta + low[i];
        }
        let showRow = true
        if (feature.getProperty('livability_variable') == null ||
            isNaN(feature.getProperty('livability_variable'))) {
            color=[0, 0, 50]
        }
        let outlineWeight = 0.5,
            zIndex = 1;
        if (feature.getProperty("state") === "hover") {
            outlineWeight = 2;
            zIndex = 2;
        }
        return {
            strokeWeight: outlineWeight,
            strokeColor: "#fff",
            zIndex: zIndex,
            fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
            fillOpacity: 0.75,
            visible: showRow,
        };
    }

    const loadData = (variable) => {
        let min = Number.MAX_VALUE, max = -Number.MAX_VALUE
        GetScene(variable).then((res) => {
            let data = res['Metrics']
            // setCurrentSceneData(data)
            // updateSceneDataRef.current = data
            data.forEach(function(row) {
                let livabilityVariable = parseFloat(row.totalMetrics);
                let neutralMetric = parseFloat(row.neutralMetric);
                let negativeMetric = parseFloat(row.negativeMetric);
                let positiveMetric = parseFloat(row.positiveMetric);
                let locId = row.location;
                // keep track of min and max values.
                if (livabilityVariable < min) {
                    min = livabilityVariable
                }
                if (livabilityVariable > max) {
                    max = livabilityVariable
                }
                // update the existing row with the new data
                // map.data.getFeatureById(locId).setProperty('livability_variable', livabilityVariable);
                map.data.forEach((feat) => {
                    if(feat.getProperty("lga_pid") == locId){
                        feat.setProperty('livability_variable', livabilityVariable);
                        feat.setProperty('neutralMetric', neutralMetric);
                        feat.setProperty('negativeMetric', negativeMetric);
                        feat.setProperty('positiveMetric', positiveMetric);
                    }
                })
            });
            if(data.length===0){
                min = 0
                max = 0
            }
            setLivabilityValMin(prev => min)
            setLivabilityValMax(prev => max)
            dispatch(setReadyFlag({flag: true}))
            dispatch(setAppReadyFlag({flag: true}))
        })
    }
    // const loadSuburbData = (lgaId, centerNew, zoomNew) => {
    //     dispatch(setReadyFlag({flag: false}))
    //     let lgaData = updateSceneDataRef.current.find(item => item['location'] === lgaId)
    //     let subData = null
    //     if (lgaData != undefined){
    //         subData = lgaData['suburbs']
    //     }
    //     clearData();
    //     GetSuburbs().then((res) => {
    //         console.log("data: ", res, zoomNew, map.getZoom(), centerNew, subData)
    //         map.data.addGeoJson(
    //             res,
    //             { idPropertyName: "lc_ply_pid" }
    //         );
    //     }).then(() => {
    //         setCenter(centerNew)
    //         smoothZoom(map, zoomNew, map.getZoom())
    //         dispatch(setReadyFlag({flag: true}))
    //     })
    // }
    const clearData = () => {
        setLivabilityValMin(Number.MAX_VALUE);
        setLivabilityValMax(-Number.MAX_VALUE);
        map.data.forEach((row) => {
            row.setProperty("livability_variable", undefined);
        });
        document.getElementById("data-caret").style.display = "none";
    }
    //init map
    useEffect(() => {
        if (ref.current && !map) {
            dispatch(setAppReadyFlag({flag: false}))
            setMap(new window.google.maps.Map(ref.current,{ styles: mapStyle, zoom, center }))
        }
    },[ref])
    useEffect(()=>{
        if(readyFlag){
            let rangeState = {
                'variableMin': livabilityValMin,
                'variableMax': livabilityValMax
            }
            console.log("on ready set legend hook", rangeState)
            dispatch(setVariableRange(rangeState))
        }
    },[readyFlag, livabilityValMin, livabilityValMax])
    // load geo data ,and trigger change
    useEffect(() => {
        if(map){
            console.log("load geojson hook")
            const selectBox = document.getElementById("livability-variable");
            window.google.maps.event.addDomListener(selectBox, "change", () => {
                dispatch(setReadyFlag({flag: false}))
                dispatch(setSelectedTopic(selectBox.options[selectBox.selectedIndex].value))
                clearData();
                loadData(selectBox.options[selectBox.selectedIndex].value);
            });
            map.data.loadGeoJson(
                VIC_STATE_BOUNDARIES_JSON_PATH,
                { idPropertyName: "lg_ply_pid" },
                // { idPropertyName: "lga_pid" },
                (feat)=>{
                    window.google.maps.event.trigger(
                        document.getElementById("livability-variable"),
                        "change"
                    );
                }
            );
        }
    },[map])
    useEffect(() => {
        if(map){
            console.log("mouseEvent hook")
            map.data.setStyle(styleFeature);
            map.data.addListener("mouseover", mouseInToRegion);
            map.data.addListener("mouseout", mouseOutOfRegion);
            map.data.addListener("click", clickRegion);
        }
    },[range])
    // regi listener
    useEffect(() => {
        if (map) {
            ["click", "idle"].forEach((eventName) =>
                window.google.maps.event.clearListeners(map, eventName)
            );
            if (onClick) {
                map.addListener("click", onClick);
            }

            if (onIdle) {
                map.addListener("idle", () => onIdle(map));
            }
        }
    }, [map, onClick, onIdle])
    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);
    return <div ref={ref} style={style}/>
};

export default memo(Map);