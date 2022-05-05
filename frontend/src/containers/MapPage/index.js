import React, {memo, useEffect, useState} from 'react';
import { Wrapper} from "@googlemaps/react-wrapper";
import {GOOGLE_MAP_API_KEY} from "../../utils/constants";
import Map from "../../components/Map";
import SelectBar from "../../components/SelectBar";
import "./index.scss"
import './index.scss'
import {GetSports} from "../../api";


const MapPage = () => {
    const [sportsData, setSportsData] = useState([])
    useEffect(() => {
        GetSports().then((res)=>{
            let data = res['Metrics']
            setSportsData(data)
        })
    }, [])
    const render = (status) => {
        return <h1>{status}</h1>;
    }
    return (
        <div className="mapContainer">
            <Wrapper apiKey={GOOGLE_MAP_API_KEY} render={render}>
                <SelectBar />
                <Map style={{height:"100%",width:"100%"}} sportsData={sportsData}/>
            </Wrapper>
        </div>
    );
};

export default memo(MapPage);