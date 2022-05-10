import React, { memo, useRef, useEffect, useState } from 'react';
import useDeepCompareEffectForMaps from "use-deep-compare-effect";
import { useSelector, useDispatch } from "react-redux";
import { selectVariableRange, selectSelectedTopic, setVariableRange, setSelectedTopic } from '../../store/reducers/selectBar'
import { readyFlagSelector, sceneDataSelector, setReadyFlag } from '../../store/reducers/map'
import './index.scss';
import mapStyle from "../../asset/map_style";
import { VIC_STATE_BOUNDARIES_JSON_PATH } from "../../utils/constants";
import { GetScene } from "../../api";

const Map = ({
                // sportsData,
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
    const sceneData = useSelector(sceneDataSelector);
    const selectedTopic = useSelector(selectSelectedTopic);
    const dispatch = useDispatch()
    const ref = useRef(null)
    const [zoom, setZoom] = useState(7); // initial zoom
    const [center, setCenter] = useState({
        lat: -37.7998,
        lng: 144.9460,
    });
    const [map, setMap] = useState(null)
    const [livabilityValMin, setLivabilityValMin] = useState(Number.MAX_VALUE)
    const [livabilityValMax, setLivabilityValMax] = useState(-Number.MAX_VALUE)
    const [infoBox] = useState(new window.google.maps.InfoWindow({content: ''}))
    const mouseInToRegion = (e) => {
        e.feature.setProperty("state", "hover");
        if (e.feature.getProperty("livability_variable")){
            const percent =
                ((e.feature.getProperty("livability_variable") - livabilityValMin) /
                    (livabilityValMax - livabilityValMin)) *
                100;
            document.getElementById("data-caret").style.display = "block";
            document.getElementById("data-caret").style.paddingLeft = percent + "%";
            infoBox.setPosition(e.latLng)
            let content = (
                `
                <div>
                    location: ${e.feature.getProperty("vic_lga__2")}
                </div>
                <div>
                    score: ${e.feature.getProperty("livability_variable").toFixed(2)}
                </div>
            `
            )
            infoBox.setContent(content)
            infoBox.open(map)
        }
    }
    const mouseOutOfRegion = (e) => {
        e.feature.setProperty("state", "normal");
        infoBox.close()
    }
    const styleFeature = (feature) => {
        let low = [5, 69, 54]; // color of smallest datum
        let high = [151, 83, 34]; // color of largest datum
        // delta represents where the value sits between the min and max
        let delta =
            (feature.getProperty("livability_variable") - livabilityValMin) /
            (livabilityValMax - livabilityValMin);
        let color = [];
        for (let i = 0; i < 3; i++) {
            // calculate an integer color based on the delta
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
        console.log("select: ", variable)
        let min = Number.MAX_VALUE, max = -Number.MAX_VALUE
        GetScene(variable).then((res) => {
            let data = res['Metrics']
            data.forEach(function(row) {
                let livabilityVariable = parseFloat(row.totalMetrics);
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
        })

    }
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
            console.log("init Map hook")
            setMap(new window.google.maps.Map(ref.current,{ styles: mapStyle, zoom, center }))
        }
    },[ref])
    // useEffect(() => {
    //     if(map){
    //         console.log("load property hook")
    //
    //     }
    // },[map])
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
                console.log("looklook:", selectedTopic)
                loadData(selectBox.options[selectBox.selectedIndex].value);
            });
            map.data.loadGeoJson(
                VIC_STATE_BOUNDARIES_JSON_PATH,
                { idPropertyName: "lg_ply_pid" },
                // { idPropertyName: "lga_pid" },
                (feat)=>{
                    console.log("length:", feat.length)
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