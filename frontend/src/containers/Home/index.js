import React, { useState } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import './index.scss'
import MapPage from "../../containers/MapPage"
import {Button, Spin} from "antd";
import { SmileOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";
import { appReadyFlagSelector } from '../../store/reducers/map'
import CollapsePanel from "../../components/CollapsePanel";
import HomeCarousel from "../../components/HomeCarousel";

const Home = () => {
    const alignCenter = { display: 'flex', alignItems: 'center' }
    const appReadyFlag = useSelector(appReadyFlagSelector)
    const [triggeredIdx, setTriggeredIdx] = useState("0")
    const [defaultTxt, setDefaultTxt] = useState("We selected weather, diet, sports and traffic as indicators, and analyzed the emotions through collecting twitter and AURIN data to reflect the scores of various regions in Victoria and local areas in Melbourne.")
    const indicatorTxt = {
        "1": "Through the statistics of Melbourne's weather indicators by month, the x-axis of the line chart shows the weather indicators of each month in each year in the unit of year.",
        "2": "Bars and coffee shops reflect how relaxed an area is, so check out the scores and ratios we collected for the number of cafes and bars in some areas!",
        "3": "Sport is an important part of improving quality of life, so we gathered sports-related data for the Melbourne region over the past decade to come up with the score shown here.",
    }
    const updateTxt = (index) => {
        setTriggeredIdx(index)
    };
    return (
        <div className='homeContainer' id='homeContainer'>
            <Spin spinning={ !appReadyFlag } size="large" tip="Initializing, Please Wait...." />
            <Parallax pages={3.2}  style={{display: appReadyFlag? "block" : "none"}}>
                <ParallaxLayer offset={0} speed={0.5}>
                    <div className={"banner"}>
                        <div className="author">
                            <h1 className='title'>Team 28 Profile</h1>
                            <HomeCarousel />
                        </div>
                        <div className="intro">
                            <div className="title">About This</div>
                            <div className="content">
                                <p>This is the presentation website for Team 28 of the S1 2022 COMP90033 Clustering and Cloud Computing assignment 2 at the University of Melbourne.</p>
                                <p></p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                            </div>
                            <div className="explore">
                                <Button size="large" ghost>Scroll to Discover More! ↓</Button>
                            </div>

                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer sticky={{ start: 1, end: 1.1 }} style={{ ...alignCenter, justifyContent: 'flex-start', zIndex:-1 }}>
                    <div className={'sticky'}>
                        <div className="title">
                            Melbourne's Livability
                        </div>
                        <div className="content">
                            {indicatorTxt[triggeredIdx]?indicatorTxt[triggeredIdx]: defaultTxt}
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={1.2} speed={1.5} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
                    <div className={`charts ${'white'}`}>
                        <div className="title">
                            <span>See what we found ! </span>
                            <SmileOutlined />
                        </div>
                        <CollapsePanel updateTxt={updateTxt}/>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={2} speed={1.5}>
                    <div className='mapCard'>
                        <h2 className="mapTitle">More Fun on the Map !</h2>
                        <div className="mapContent content">
                            <p className="content1">Sentiment analysis of tweets revealed residents' attitudes to the subject matter in each region of VIC.</p>
                            <p className="content2">Tip: You can click on the city area on the map for more detailed local area information !</p>
                        </div>
                        <MapPage />
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>

    );
};

export default React.memo(Home);