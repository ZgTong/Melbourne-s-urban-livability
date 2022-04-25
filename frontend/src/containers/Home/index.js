import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import './index.scss'
import { Link } from "react-router-dom";
import MapPage from "../../containers/MapPage";

const Home = () => {
    const alignCenter = { display: 'flex', alignItems: 'center' }
    return (
        <div className='homeContainer'>
            <Parallax pages={3}>
                <ParallaxLayer offset={0} speed={0.5}>
                    <div className={"banner"}>
                        <div className="author">
                            <h1 className='title'>Team 28 Info: </h1>
                            <ul className='authorList'>
                                <li>ZuguangTong</li>
                                <li>Shangyuan Zhi</li>
                                <li>Jinyu Tan</li>
                                <li>Zixuan Guo</li>
                                <li>Ruoyi Gan</li>
                            </ul>
                        </div>
                        <div className="intro">
                            <div className="title">Here is Introduction !!!</div>
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