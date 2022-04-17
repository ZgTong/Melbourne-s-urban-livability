import React, { useEffect } from 'react';
import './index.scss'

const Map = () => {
    useEffect(() => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center:  {lat: -37.7998, lng: 144.9460}
        })
    }, [])

    return (
        <div className='map_container'>
            <div id="map">

            </div>
        </div>
    );
};

export default Map;