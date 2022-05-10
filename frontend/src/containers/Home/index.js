import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import './index.scss'
import MapPage from "../../containers/MapPage"
import { Carousel } from "antd";

const Home = () => {
    const alignCenter = { display: 'flex', alignItems: 'center' }
    return (
        <div className='homeContainer'>
            <Parallax pages={3}>
                <ParallaxLayer offset={0} speed={0.5}>
                    <div className={"banner"}>
                        <div className="author">
                            <h1 className='title'>Team 28 Info: </h1>
                            <Carousel autoplay autoplaySpeed={3000}>
                                <div className='carousel_card'>
                                    <h3 className='name'>Jinyu Tan</h3>
                                    <p className='role'>Role: Backend Developer</p>
                                    <p className='description'>Job description.</p>
                                </div>
                                <div className='carousel_card'>
                                    <h3 className='name'>Ruoyi Gan</h3>
                                    <p className='role'>Role: Data analyst</p>
                                    <p className='description'>Job description.</p>
                                </div>
                                <div className='carousel_card'>
                                    <h3 className='name'>Yuanzhi Shang</h3>
                                    <p className='role'>Role: Operations</p>
                                    <p className='description'>Job description.</p>
                                </div>
                                <div className='carousel_card'>
                                    <h3 className='name'>Zixuan Guo</h3>
                                    <p className='role'>Role: Data analyst</p>
                                    <p className='description'>Job description.</p>
                                </div>
                                <div className='carousel_card'>
                                    <h3 className='name'>Zuguang Tong</h3>
                                    <p className='role'>Role: Frontend Developer</p>
                                    <p className='description'>Built a front-end app that uses React as a framework, Google Maps API and Ant Design as a visualization tool.</p>
                                </div>
                            </Carousel>
                        </div>
                        <div className="intro">
                            <div className="title">About this</div>
                            <div className="content">
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                                <p>Here is Content !!!</p>
                            </div>

                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer sticky={{ start: 1, end: 2.5 }} style={{ ...alignCenter, justifyContent: 'flex-start', zIndex:-1 }}>
                    <div className={'sticky'}>
                        <div className="title">
                            Melbourne's Livability
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={1.2} speed={1.5} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
                    <div className='mapCard'>
                        <MapPage />
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={2} speed={1.5} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
                    <div className={`${'card'} ${'parallax'} ${'blue'}`}>
                        <p>Other Analysis</p>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>

    );
};

export default React.memo(Home);