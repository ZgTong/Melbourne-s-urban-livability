import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Data } from '@react-google-maps/api'
import { Spin } from 'antd'
import './index.scss'
import {GOOGLE_MAP_API_KEY, VIC_STATE_BOUNDARIES_JSON_PATH} from "../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {
    selectSelectedTopic,
    selectVariableRange,
    setSelectedTopic,
    setVariableRange
} from "../../store/reducers/selectBar";
import {readyFlagSelector, sceneDataSelector, setReadyFlag} from "../../store/reducers/map";
import {renderToString} from "react-dom/server";
// import InfoBox from "../InfoBox";
import {GetScene} from "../../api";

function NewMap() {
    const range = useSelector(selectVariableRange);
    const readyFlag = useSelector(readyFlagSelector);
    const sceneData = useSelector(sceneDataSelector);
    const selectedTopic = useSelector(selectSelectedTopic);
    const dispatch = useDispatch()
    const ref = useRef(null)
    const [zoom, setZoom] = useState(9); // initial zoom
    const [center, setCenter] = useState({
        lat: -37.7998,
        lng: 144.9460,
    });
    const [map, setMap] = useState(null)
    const [livabilityValMin, setLivabilityValMin] = useState(Number.MAX_VALUE)
    const [livabilityValMax, setLivabilityValMax] = useState(-Number.MAX_VALUE)
    // const [infoBox] = useState(new window.google.maps.InfoWindow({content: ''}))
    const mouseInToRegion = (e) => {
        e.feature.setProperty("state", "hover");
        console.log(e.feature.getProperty("vic_lga__2"))
        // infoBox.setPosition(e.latLng)
        // infoBox.setContent(renderToString(<InfoBox { ...{location: e.feature.getProperty("vic_lga__2"), score:2 }}/>))
        // infoBox.open(map)
        if (e.feature.getProperty("livability_variable")){
            const percent =
                ((e.feature.getProperty("livability_variable") - livabilityValMin) /
                    (livabilityValMax - livabilityValMin)) *
                100;
            document.getElementById("data-caret").style.display = "block";
            document.getElementById("data-caret").style.paddingLeft = percent + "%";
            // infoBox.setPosition(e.latLng)
            let content = (
                <div>

                    <div>
                        location: {}
                    </div>
                    <div>
                        score: {}
                    </div>
                </div>
            )
            // infoBox.setContent(renderToString(<InfoBox { ...{location: e.feature.getProperty("vic_lga__2"), score:e.feature.getProperty("livability_variable").toFixed(2) }}/>))
            // infoBox.open(map)
        }
    }
    const mouseOutOfRegion = (e) => {
        e.feature.setProperty("state", "normal");
        // infoBox.close()
    }

    const clickRegion = (e) => {
        console.log("click", e.feature.latLng)
        setZoom(12)
        setCenter(e.latLng)
        map.setCenter(e.latLng)
        map.setZoom(12)
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
    const containerStyle = {height:"100%",width:"100%"}

    const onDataLoad = (data) => {
        data.loadGeoJson(
            VIC_STATE_BOUNDARIES_JSON_PATH,
            { idPropertyName: "lg_ply_pid" },
            // { idPropertyName: "lga_pid" },
            (feat)=>{
                console.log("length:", feat)
                window.google.maps.event.trigger(
                    document.getElementById("livability-variable"),
                    "change"
                );
            }
        )
    }

    const onMapLoad = (map) =>{
        const selectBox = document.getElementById("livability-variable");
        console.log(map)
        // map.event.addDomListener(selectBox, "change", () => {
        //     dispatch(setReadyFlag({flag: false}))
        //     dispatch(setSelectedTopic(selectBox.options[selectBox.selectedIndex].value))
        //     clearData();
        //     console.log("looklook:", selectedTopic)
        //     loadData(selectBox.options[selectBox.selectedIndex].value);
        // });
    }
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

    useEffect(() => {
        if(map){
            console.log("mouseEvent hook")
            // map.data.setStyle(styleFeature);
            map.data.addListener("mouseover", mouseInToRegion);
            map.data.addListener("mouseout", mouseOutOfRegion);
            map.data.addListener("click", clickRegion);
        }
    },[range])
    return (
        <div className='map_container'>
            <LoadScript
                googleMapsApiKey={GOOGLE_MAP_API_KEY}
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onMapLoad}
                >
                    { /* Child components, such as markers, info windows, etc. */ }
                    <Data
                        onLoad={onDataLoad}
                        options={{
                            controlPosition: window.google ? window.google.maps.ControlPosition.TOP_LEFT : undefined,
                            strokeWeight: 2,
                            strokeColor: "#00FF55",
                            zIndex: 2,
                            fillColor:"#FF0055",
                            fillOpacity: 1,
                            visible: true,
                            strokeOpacity: 1,
                        }}
                    />
                </GoogleMap>
            </LoadScript>
        </div>
    )
}

export default NewMap;