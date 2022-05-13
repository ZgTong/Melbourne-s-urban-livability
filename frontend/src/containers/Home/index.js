import React, {useRef, useState} from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import './index.scss'
import MapPage from "../../containers/MapPage"
import {Button, Spin} from "antd";
import { LineChartOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";
import { appReadyFlagSelector } from '../../store/reducers/map'
import CollapsePanel from "../../components/CollapsePanel";
import HomeCarousel from "../../components/HomeCarousel";

const Home = () => {
    const alignCenter = { display: 'flex', alignItems: 'center' }
    const appReadyFlag = useSelector(appReadyFlagSelector)
    return (
        <div className='homeContainer' id='homeContainer'>
            <Spin spinning={ !appReadyFlag } size="large" tip="Initializing, Please Wait...." />
            <Parallax pages={3}  style={{display: appReadyFlag? "block" : "none"}}>
                <ParallaxLayer offset={0} speed={0.5}>
                    <div className={"banner"}>
                        <div className="author">
                            <h1 className='title'>Team 28 Info: </h1>
                            <HomeCarousel />
                        </div>
                        <div className="intro">
                            <div className="title">About this shit</div>
                            <div className="content">
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
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
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={1.2} speed={1.5} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
                    <div className={`charts ${'white'}`}>
                        <div className="title">
                            <span>See what do we have </span>
                            <LineChartOutlined />
                        </div>
                        <CollapsePanel />
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={2} speed={1.5}>
                    <div className='mapCard'>
                        <MapPage />
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>

    );
};

export default React.memo(Home);