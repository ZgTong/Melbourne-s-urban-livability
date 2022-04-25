import React from 'react';
const { GoogleMap,Data } = require("@react-google-maps/api");

const mapContainerStyle = {
    height: "400px",
    width: "800px"
}

const center = {lat: -37.7998, lng: 144.9460}

const  onLoad = async data => {
    console.log('data: ', data)
    data.loadGeoJson(
        "https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json",
        { idPropertyName: "SUBURB" }
    );
}


const Index = () => {
    return (
        <GoogleMap
            id="data-example"
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={center}
        >
            <Data
                onLoad={onLoad}
                options={
                    {
                        style:{
                            controlPosition: window.google ? window.google.maps.ControlPosition.TOP_LEFT : undefined,
                            controls: ["Point"],
                            drawingMode: "Point", //  "LineString" or "Polygon".
                            featureFactory: geometry => {
                                console.log("geometry: ", geometry);
                            },
                            // Type:  boolean
                            // If true, the marker receives mouse and touch events. Default value is true.
                            clickable: true,

                            // Type:  string
                            // Mouse cursor to show on hover. Only applies to point geometries.
                            // cursor: 'cursor',

                            // Type:  boolean
                            // If true, the object can be dragged across the map and the underlying feature will have its geometry updated. Default value is false.
                            draggable: true,

                            // Type:  boolean
                            // If true, the object can be edited by dragging control points and the underlying feature will have its geometry updated. Only applies to LineString and Polygon geometries. Default value is false.
                            editable: false,

                            // Type:  string
                            // The fill color. All CSS3 colors are supported except for extended named colors. Only applies to polygon geometries.
                            fillColor: "#ff0000",

                            // Type:  number
                            // The fill opacity between 0.0 and 1.0. Only applies to polygon geometries.
                            fillOpacity: 1,

                            // Type:  string|Icon|Symbol
                            // Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url. Only applies to point geometries.
                            // icon: 'icon',

                            // Type:  MarkerShape
                            // Defines the image map used for hit detection. Only applies to point geometries.
                            // shape: 'shape',

                            // Type:  string
                            // The stroke color. All CSS3 colors are supported except for extended named colors. Only applies to line and polygon geometries.
                            strokeColor: "#00FF55",

                            // Type:  number
                            // The stroke opacity between 0.0 and 1.0. Only applies to line and polygon geometries.
                            strokeOpacity: 1,

                            // Type:  number
                            // The stroke width in pixels. Only applies to line and polygon geometries.
                            strokeWeight: 2,

                            // Type:  string
                            // Rollover text. Only applies to point geometries.
                            title: "Title",

                            // Type:  boolean
                            // Whether the feature is visible. Defaults to true.
                            visible: true,

                            // Type:  number
                            // All features are displayed on the map in order of their zIndex, with higher values displaying in front of features with lower values. Markers are always displayed in front of line-strings and polygons.
                            zIndex: 2
                        }
                    }}
            />
        </GoogleMap>
    )
};

export default Index;
