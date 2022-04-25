import React, { memo, useRef, useEffect, useState } from 'react';
import useDeepCompareEffectForMaps from "use-deep-compare-effect";
import './index.scss'
import mapStyle from "../../asset/map_style";
import { VIC_STATE_BOUNDARIES_JSON_PATH} from "../../utils/constants";

const Map = ({
                style,
                children,
                onClick = (e)=>{
                    console.log("click:", e)},
                onIdle = (e)=>{
                    console.log("idle:", e)},
                ...options
             }) => {
    const ref = useRef(null)
    const zoom = 13;
    const center = {lat: -37.7998, lng: 144.9460}
    const [map, setMap] = useState()
    const [infoBox, setInfoBox] = useState(new window.google.maps.InfoWindow({content: "hello"}))
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
        let showRow = true
        let outlineWeight = 0.5,
            zIndex = 1;
        if (feature.getProperty("state") === "hover") {
            outlineWeight = 4;
            zIndex = 8;
        }
        return {
            strokeWeight: outlineWeight,
            strokeColor: "#000",
            zIndex: zIndex,
            fillColor: "rgba(255, 0, 0, .5)",
            fillOpacity: 0.75,
            visible: showRow,
        };
    }

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options);
        }
    }, [map, options]);

    useEffect(() => {
        if (ref.current && !map) {
            // dispatch(createMap({ele: ref.current, zoom, center, styles: mapStyle}))
            setMap(new window.google.maps.Map(ref.current,{ styles: mapStyle, zoom, center }))
        }
        if(map){
            map.data.loadGeoJson(
                VIC_STATE_BOUNDARIES_JSON_PATH,
                { idPropertyName: "SUBURB" }
            );
            console.log("rendered")
            // set up the style rules and events for google.maps.Data
            map.data.setStyle(styleFeature);
            map.data.addListener("mouseover", mouseInToRegion);
            map.data.addListener("mouseout", mouseOutOfRegion);
        }
        // infoBox.open({map})
    }, [ref,map]);
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
    }, [map, onClick, onIdle]);
    return <div ref={ref} style={style} />
};

export default memo(Map);