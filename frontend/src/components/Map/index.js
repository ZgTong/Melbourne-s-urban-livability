import React, {memo, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectVariableRange, selectSelectedTopic, setVariableRange, setSelectedTopic } from '../../store/reducers/selectBar'
import { readyFlagSelector, setReadyFlag, setAppReadyFlag } from '../../store/reducers/map'
import './index.scss';
import mapStyle from "../../asset/map_style";
import { VIC_STATE_BOUNDARIES_JSON_PATH } from "../../utils/constants";
import {GetScene, GetSuburbs} from "../../api";
import useGoogleCharts from "../../utils/useGoogleCharts";
import {message} from "antd";
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
    const [cityDataLayer, setCityDataLayer] = useState(new window.google.maps.Data())
    const [subDataLayer, setSubDataLayer] = useState(new window.google.maps.Data())
    const [granularity, setGranularity] = useState('city')
    const updateGranularityRef= useRef('city')
    const [livabilityValMin, setLivabilityValMin] = useState(Number.MAX_VALUE)
    const livabilityValMinRef= useRef(Number.MAX_VALUE)
    const [livabilityValMax, setLivabilityValMax] = useState(-Number.MAX_VALUE)
    const livabilityValMaxRef= useRef(-Number.MAX_VALUE)
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
        if (e.feature.getProperty("livability_variable")){
            const percent =
                ((e.feature.getProperty("livability_variable") - 0) /
                    (1 - 0)) *
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
            if(updateGranularityRef.current == "city"){
                locNode.innerHTML = `Location: <span class="fw_normal">${e.feature.getProperty("vic_lga__2")}</span>`;
            }else{
                locNode.innerHTML = `Location: <span class="fw_normal">${e.feature.getProperty("vic_loca_2")}</span>`;
            }
            drawPieChart(chartData, chartNode, "Pie chart of Twitter sentiment ratio")
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
        setGranularity("suburb")
        updateGranularityRef.current = "suburb"
        infoBox.close()
        loadSuburbData(e.feature.getProperty("lg_ply_pid"), e.feature.getProperty("lga_pid"), e.latLng, 12)
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
            setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
        }
    }
    const styleFeature = (feature) => {
        let low = [5, 69, 54]; // color of smallest datum
        let high = [151, 83, 34]; // color of largest datum
        let delta = feature.getProperty("livability_variable")
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
    const calcData = (data) => {
        let min = Number.MAX_VALUE, max = -Number.MAX_VALUE
        if(data){
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
                if(updateGranularityRef.current == "city") {
                    cityDataLayer.forEach((feat) => {
                        if (feat.getProperty("lga_pid") == locId) {
                            feat.setProperty('livability_variable', livabilityVariable);
                            feat.setProperty('neutralMetric', neutralMetric);
                            feat.setProperty('negativeMetric', negativeMetric);
                            feat.setProperty('positiveMetric', positiveMetric);
                        }
                    })
                }else {
                    subDataLayer.forEach((feat) => {
                        if (feat.getProperty("loc_pid") == locId) {
                            feat.setProperty('livability_variable', livabilityVariable);
                            feat.setProperty('neutralMetric', neutralMetric);
                            feat.setProperty('negativeMetric', negativeMetric);
                            feat.setProperty('positiveMetric', positiveMetric);
                        }
                    })
                }
            });
        }
        if(data.length===0){
            min = 0
            max = 0
        }
        if(data.length===1){
            min = 0
        }
        setLivabilityValMin(prev => min)
        livabilityValMinRef.current = min
        setLivabilityValMax(prev => max)
        livabilityValMaxRef.current = max
    }
    const loadData = (variable) => {
        GetScene(variable).then((res) => {
            let data = res['Metrics']
            setCurrentSceneData(data)
            updateSceneDataRef.current = data
            calcData(data)
            dispatch(setReadyFlag({flag: true}))
            dispatch(setAppReadyFlag({flag: true}))
        })
    }
    const loadSuburbData = (lg_ply_pid, lgaId, centerNew, zoomNew) => {
        dispatch(setReadyFlag({flag: false}))
        let lgaData = updateSceneDataRef.current.find(item => item['location'] === lgaId)
        let subData = null
        if (lgaData != undefined){
            subData = lgaData['suburbs']
        } else{
            message.info("Sorry...There are NO Relevant Data")
            dispatch(setReadyFlag({flag: true}))
            return
        }
        if (!subData || subData.length===0) {
            message.info("Sorry...There are NO Relevant Data")
            dispatch(setReadyFlag({flag: true}))
            return
        }
        GetSuburbs().then((res) => {
            const subPolygon = {
                "type": "FeatureCollection",
                "features": res[lg_ply_pid]
            }
            subDataLayer.forEach((feat) => {
                subDataLayer.remove(feat)
            })
            subDataLayer.addGeoJson(
                subPolygon,
                { idPropertyName: "lc_ply_pid" }
            );
            cityDataLayer.setMap(null)
            clearData()
            calcData(subData)
            subDataLayer.addListener("mouseover", mouseInToRegion);
            subDataLayer.addListener("mouseout", mouseOutOfRegion);
            // subDataLayer.setStyle(styleFeature);
            subDataLayer.setMap(map)
        }).then(() => {
            dispatch(setReadyFlag({flag: true}))
            map.setCenter(centerNew)
            smoothZoom(map, zoomNew, map.getZoom())
        })
    }
    const clearData = () => {
        setLivabilityValMin(Number.MAX_VALUE);
        livabilityValMinRef.current = Number.MAX_VALUE
        setLivabilityValMax(-Number.MAX_VALUE);
        livabilityValMaxRef.current = -Number.MAX_VALUE
        if(updateGranularityRef.current == "city"){
            cityDataLayer.forEach((row) => {
                row.setProperty("livability_variable", undefined);
            });
        }else{
            subDataLayer.forEach((row) => {
                row.setProperty("livability_variable", undefined);
            });
        }
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
            if(updateGranularityRef.current === "city"){
                subDataLayer.setMap(null)
                cityDataLayer.setStyle(styleFeature);
            }else{
                cityDataLayer.setMap(null)
                subDataLayer.setStyle(styleFeature);
            }
            dispatch(setVariableRange(rangeState))
        }
    },[readyFlag, livabilityValMin, livabilityValMax])
    // load geo data ,and trigger change
    useEffect(() => {
        if(map && googleChart){
            const selectBox = document.getElementById("livability-variable");
            window.google.maps.event.addDomListener(selectBox, "change", () => {
                dispatch(setReadyFlag({flag: false}))
                dispatch(setSelectedTopic(selectBox.options[selectBox.selectedIndex].value))
                clearData();
                setGranularity("city")
                updateGranularityRef.current = "city"
                infoBox.close()
                subDataLayer.setMap(null)
                cityDataLayer.setMap(map)
                dispatch(setReadyFlag({flag: true}))
                map.setCenter(center)
                map.setZoom(zoom)
                loadData(selectBox.options[selectBox.selectedIndex].value);
            });
            cityDataLayer.setMap(map)
            cityDataLayer.loadGeoJson(
                VIC_STATE_BOUNDARIES_JSON_PATH,
                { idPropertyName: "lg_ply_pid" },
                (feat)=>{
                    cityDataLayer.addListener("mouseover", mouseInToRegion);
                    cityDataLayer.addListener("mouseout", mouseOutOfRegion);
                    cityDataLayer.addListener("click", clickRegion);
                    window.google.maps.event.trigger(
                        document.getElementById("livability-variable"),
                        "change"
                    );
                }
            )
        }
    },[map, googleChart, updateSceneDataRef])
    return <div ref={ref} style={style}/>
};

export default memo(Map);