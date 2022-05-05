import React, { memo, useRef, useEffect, useState } from 'react';
import useDeepCompareEffectForMaps from "use-deep-compare-effect";
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
    const ref = useRef(null)
    const [zoom, setZoom] = React.useState(6); // initial zoom
    const [center, setCenter] = React.useState({
        lat: -37.7998,
        lng: 144.9460,
    });
    const [map, setMap] = useState(null)
    const [livabilityValMin, setLivabilityValMin] = useState(Number.MAX_VALUE)
    const [livabilityValMax, setLivabilityValMax] = useState(-Number.MAX_VALUE)
    const [infoBox] = useState(new window.google.maps.InfoWindow({content: "hello"}))
    const mouseInToRegion = (e) => {
        e.feature.setProperty("state", "hover");
        infoBox.setPosition(e.latLng)
        infoBox.setContent(e["feature"]["j"]["vic_lga__2"])
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
            if (livabilityVariable > livabilityValMax) {
                max = livabilityVariable
            }
            // update the existing row with the new data
            map.data.getFeatureById(locId).setProperty('livability_variable', livabilityVariable);
        });
        setLivabilityValMin(min)
        setLivabilityValMax(max)
        // update and display the legend
        document.getElementById('livability-min').textContent =
            livabilityValMin.toLocaleString();
        document.getElementById('livability-max').textContent =
            livabilityValMax.toLocaleString();
    }
    const clearData = () => {
        setLivabilityValMin(Number.MAX_VALUE);
        setLivabilityValMax(-Number.MAX_VALUE);
        map.data.forEach((row) => {
            row.setProperty("livability_variable", undefined);
        });
    }

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    useEffect(() => {
        // init map
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current,{ styles: mapStyle, zoom, center }))
        }
        if(map){
            map.data.setStyle(styleFeature);
            map.data.addListener("mouseover", mouseInToRegion);
            map.data.addListener("mouseout", mouseOutOfRegion);
            // wire up the button
            const selectBox = document.getElementById("livability-variable");
            window.google.maps.event.addDomListener(selectBox, "change", () => {
                clearData();
                loadData(selectBox.options[selectBox.selectedIndex].value);
            });
        }
    },[ref, map, sportsData])
    
    useEffect(() => {
        if(map){
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
    return <div ref={ref} style={style}/>
};

export default memo(Map);