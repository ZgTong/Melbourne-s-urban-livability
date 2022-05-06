import React, { memo, useRef, useEffect, useState } from 'react';
import useDeepCompareEffectForMaps from "use-deep-compare-effect";
import { useSelector, useDispatch } from "react-redux";
import { selectVariableRange, setVariableRange } from '../../store/reducers/selectBar'
import { readyFlagSelector, setReadyFlag } from '../../store/reducers/map'
import './index.scss';
import mapStyle from "../../asset/map_style";
import { VIC_STATE_BOUNDARIES_JSON_PATH } from "../../utils/constants";

const Map = ({
                sportsData,
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
    // const [readyFlag, setReadyFlag] = useState(false)
    const [infoBox] = useState(new window.google.maps.InfoWindow({content: ''}))
    const mouseInToRegion = (e) => {
        e.feature.setProperty("state", "hover");
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
            showRow = false;
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
        sportsData.forEach(function(row) {
            let livabilityVariable = parseFloat(row.metrics);
            let locId = row.location;
            // keep track of min and max values.
            if (livabilityVariable < min) {
                min = livabilityVariable
            }
            if (livabilityVariable > max) {
                max = livabilityVariable
            }
            // update the existing row with the new data
            map.data.getFeatureById(locId).setProperty('livability_variable', livabilityVariable);
        });
        setLivabilityValMin(prev => min)
        setLivabilityValMax(prev => max)
        // setReadyFlag(true)
        dispatch(setReadyFlag({flag: true}))
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
    useEffect(() => {
        if(map && sportsData.length > 0){
            console.log("load property hook")
            const selectBox = document.getElementById("livability-variable");
            window.google.maps.event.addDomListener(selectBox, "change", () => {
                dispatch(setReadyFlag({flag: false}))
                // setReadyFlag(false)
                clearData();
                loadData(selectBox.options[selectBox.selectedIndex].value);
            });
        }
    },[map, sportsData])
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
            map.data.loadGeoJson(
                VIC_STATE_BOUNDARIES_JSON_PATH,
                { idPropertyName: "lga_pid" },
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