import React, { memo, useEffect, useRef } from 'react'
import PieChart from '../PieChart'
import './index.scss'

const InfoBox = (
    options
) => {
    useEffect(() => {
        console.log("info:", options)
    }, [])
    return (
        <div className='infoContentBox'>
            <div className="loc_name">
                Location: <span className="name">{options.location}</span>
            </div>
            <div className="total_score">
                Total liveability index: <span className="score">{options.score}</span>
            </div>
        </div>
    );
};

export default memo(InfoBox);
