import React from 'react';
import { Column } from '@ant-design/plots';

const ColumnPlot = (props) => {
    const { data } = props;
    const config = {
        data,
        isStack: true,
        xField: 'location',
        yField: 'value',
        seriesField: 'type',
        label: {
            position: 'middle',
            content: (item) => {
                return item.value.toFixed(2);
            },
            style: {
                fill: '#fff',
                fontSize: 24
            },
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
    };

    return (
        <div className="chartContainer">
            <Column {...config} />
        </div>
    );
};
export default ColumnPlot
