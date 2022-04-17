import React from 'react';
import './index.scss'
import Header from "../../components/Header";
import Map from "../../components/Map";

const Home = () => {
    return (
        <div className="home-container">
            <Header></Header>
            <Map></Map>
        </div>
    );
};

export default Home;