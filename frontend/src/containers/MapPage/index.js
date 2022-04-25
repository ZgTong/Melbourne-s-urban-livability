import React, {memo}from 'react';
import { Wrapper} from "@googlemaps/react-wrapper";
import {GOOGLE_MAP_API_KEY} from "../../utils/constants";
import Map from "../../components/Map";
import "./index.scss"
import InfoBox from "../../components/InfoBox";
import './index.scss'


const MapPage = () => {
    const render = (status) => {
        return <h1>{status}</h1>;
    };
    const position = {lat: -37.7998, lng: 144.9460}
    const content = `I'm Content`
    return (
        <div className="mapContainer">
            <Wrapper apiKey={GOOGLE_MAP_API_KEY} render={render}>
                <Map style={{height:"100%",width:"100%"}} />
            </Wrapper>
        </div>
    );
};

export default memo(MapPage);