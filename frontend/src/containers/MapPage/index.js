import React, { memo } from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";
import { useSelector } from "react-redux";
import {GOOGLE_MAP_API_KEY} from "../../utils/constants";
import Map from "../../components/Map";
import SelectBar from "../../components/SelectBar";
import NewMap from "../../components/NewMap";
import "./index.scss"
import './index.scss'


const MapPage = () => {
    const render = (status) => {
        return <h1>{status}</h1>;
    }
    return (
        <div className="mapContainer">
            <Wrapper apiKey={GOOGLE_MAP_API_KEY} render={render}>
                <SelectBar/>
                <Map style={{height:"100%",width:"100%"}}/>
            </Wrapper>
            {/*<SelectBar/>*/}
            {/*<NewMap />*/}

        </div>
    );
};

export default memo(MapPage);