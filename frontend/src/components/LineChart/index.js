import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import './index.scss'

const LineChart = (props) => {
    const { label, data, series } = props;
    const config = {
        data,
        xField: `year`,
        yField: label,
        seriesField: series,
        yAxis: {
            label: {
                formatter: (v) => `${Number.parseInt(v).toFixed(1)}`,
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };
    return (
        <div className='chartContainer'>
            <Line {...config} />
        </div>

    );
};

export default LineChart