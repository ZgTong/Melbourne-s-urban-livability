import React, { memo } from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";
import { useSelector } from "react-redux";
import {GOOGLE_MAP_API_KEY} from "../../utils/constants";
import Map from "../../components/Map";
import SelectBar from "../../components/SelectBar";
import "./index.scss"
import './index.scss'
import {Spin} from "antd";
import {readyFlagSelector} from "../../store/reducers/map";


const MapPage = () => {
    const readyFlag = useSelector(readyFlagSelector)
    const render = (status) => {
        return <h1>{status}</h1>;
    }
    return (
        <div className="mapContainer">
            <Wrapper apiKey={GOOGLE_MAP_API_KEY} render={render}>
                <SelectBar/>
                <Map style={{height:"100%",width:"100%"}}/>
                <Spin spinning={ !readyFlag } size="large" tip="Data is Loading, Please Wait Patiently...." />
            </Wrapper>
        </div>
    );
};

export default memo(MapPage);