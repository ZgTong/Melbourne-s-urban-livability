import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import './index.scss'

const LineChart = (props) => {
    const { label, data } = props;
    const config = {
        data,
        xField: `year`,
        yField: 'metric',
        seriesField: 'month',
        yAxis: {
            label: {
                formatter: (v) => `${Number.parseInt(v).toFixed(1)}`,
            },
        },
        // xAxis: {
        //     label: {
        //         formatter: (v) => `${Number.parseInt(v) % 12 == 0} ? ${yaer}+1-v`
        //     }
        // }
        legend: {
            position: 'top',
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
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