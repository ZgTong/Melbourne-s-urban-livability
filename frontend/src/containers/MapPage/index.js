import React, { memo } from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";
import { useSelector } from "react-redux";
import { readyFlagSelector } from '../../store/reducers/map'
import {GOOGLE_MAP_API_KEY} from "../../utils/constants";
import Map from "../../components/Map";
import SelectBar from "../../components/SelectBar";
import "./index.scss"
import './index.scss'
import {Spin} from "antd";


const MapPage = () => {
    const readyFlag = useSelector(readyFlagSelector);
    const render = (status) => {
        return <h1>{status}</h1>;
    }
    return (
        <div className="mapContainer">
            <Wrapper apiKey={GOOGLE_MAP_API_KEY} render={render}>
                <Spin spinning={ !readyFlag } size="large" tip="Data is Loading, Please Wait Patiently...." />
                <SelectBar style={{display: readyFlag? "block" : "none"}}/>
                <Map style={{display: readyFlag? "block" : "none",height:"100%",width:"100%"}}/>
            </Wrapper>
        </div>
    );
};

export default memo(MapPage);