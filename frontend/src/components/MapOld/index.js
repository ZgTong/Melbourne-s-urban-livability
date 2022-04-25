import {GOOGLE_MAP_API_KEY , VIC_STATE_BOUNDARIES_JSON_PATH} from "../../utils/constants";
import React, {useEffect} from 'react';
import {Wrapper} from "@googlemaps/react-wrapper";

const MapOld = () => {
    const mapStyle = [
        {
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ visibility: "on" }, { color: "#fcfcfc" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ visibility: "on" }, { color: "#bfd4ff" }],
        },
    ];
    let map;

    useEffect(()=>{
        initMap()
    })
    function initMap() {
        // load the map
        map = new window.google.maps.Map(document.getElementsByClassName("home-container"), {
            center: center,
            zoom: zoom,
            styles: mapStyle,
        });
        // set up the style rules and events for google.maps.Data
        map.data.setStyle(styleFeature);
        map.data.addListener("mouseover", mouseInToRegion);
        map.data.addListener("mouseout", mouseOutOfRegion);

        // state polygons only need to be loaded once, do them now
        loadMapShapes();
    }

    const mouseInToRegion = (e) => {
        console.log("mousein:", e["feature"]["j"]["vic_loca_2"]) //["feature"]["j"]["vic_loca_2"]
        e.feature.setProperty("state", "hover");
    }

    const mouseOutOfRegion = (e) => {
        e.feature.setProperty("state", "normal");
    }
    const zoom = 13;
    const center = {lat: -37.7998, lng: 144.9460}
    const containerStyle = {
        width: '100%',
        height: '100%'
    };

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

    /** Loads the state boundary polygons from a GeoJSON source. */
    function loadMapShapes() {
        // load US state outline polygons from a GeoJson file
        map.data.loadGeoJson(
            VIC_STATE_BOUNDARIES_JSON_PATH,
            { idPropertyName: "STATE" }
        );
    }
    return null;
};

export default MapOld;


{/*<GoogleMap*/}
{/*    id={"melMap"}*/}
{/*    mapContainerStyle={containerStyle}*/}
{/*    center={center}*/}
{/*    zoom={zoom}*/}
{/*    options={{styles: mapStyle, disableDefaultUI: true}}*/}
{/*>*/}
{/*        <Data*/}
{/*            onAddFeature={onAddFeature}*/}
{/*            onLoad={onDataLoad}*/}
{/*            onMouseOver={mouseInToRegion}*/}
{/*            onMouseOut={mouseOutOfRegion}*/}
{/*            options={*/}
{/*                {*/}
{/*                    style: {*/}
{/*                        clickable: true,*/}
{/*                        drawingMode: "Point",*/}
{/*                        fillColor: "#000",*/}
{/*                        fillOpacity: 0.75,*/}
{/*                        strokeColor: "#FF0000",*/}
{/*                        strokeOpacity: 0.5,*/}
{/*                        zIndex: 12,*/}
{/*                        visible: true*/}
{/*                    }*/}
{/*                }*/}
{/*            }*/}
{/*        />*/}
{/*</GoogleMap>*/}