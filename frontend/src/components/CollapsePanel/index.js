import React, {useState} from 'react';
import { Collapse } from 'antd';
import './index.scss'
import LineChart from "../LineChart";
import {GetBarCafe, GetLineData, GetWeather} from "../../api";
import ColumnPlot from "../ColumPlot";
import {BarChartOutlined, LineChartOutlined} from "@ant-design/icons";

const { Panel } = Collapse;

function CollapsePanel(props) {
    const { updateTxt } = props;
    const [weatherData, setWeatherData] = useState({"UVmetrics":[],"Tempmetrics":[],"Windmetrics":[],"HumidMetrics":[]});
    const [sportsData, setSportsData] = useState([]);
    const [cafeBarData, setCafeBarData] = useState([]);
    function callbackLevel1(key) {
        updateTxt(key)
        if(key === "1"){
            GetWeather().then((res) => {
                setWeatherData(res)
            })
        } else if(key === "2"){
            GetBarCafe().then((res) => {
                let chartDt = []
                for(const [k, v] of Object.entries(res.data)){
                    const dt = [
                        {
                            "location": v.locationPid,
                            "value": v.barsScore,
                            "type": "Bars"
                        },
                        {
                            "location": v.locationPid,
                            "value": v.cafesScore,
                            "type": "Cafes"
                        },
                    ]
                    chartDt = chartDt.concat(dt)
                }
                setCafeBarData(chartDt)
            })
        } else if(key === "3"){
            GetLineData("sports").then((res) => {
                setSportsData(res)
            })
        }
    }

    function callbackLevel2(key) {
        console.log("level2:", key);
    }

    return (
        <Collapse onChange={callbackLevel1} accordion ghost>
            <Panel header={<p>Weather Indicators <LineChartOutlined /></p>} key="1">
                <Collapse onChange={callbackLevel2} accordion ghost>
                    <Panel header="UVmetrics" key="11">
                        <LineChart label={'metric'} data={weatherData['UVmetrics']} series="month"/>
                    </Panel>
                    <Panel header="Tempmetrics" key="12">
                        <LineChart label={'metric'} data={weatherData['Tempmetrics']} series="month"/>
                    </Panel>
                    <Panel header="WindMetrics" key="13">
                        <LineChart label={'metric'} data={weatherData['WindMetrics']} series="month"/>
                    </Panel>
                    <Panel header="HumidMetrics" key="14">
                        <LineChart label={'metric'} data={weatherData['HumidMetrics']} series="month"/>
                    </Panel>
                </Collapse>
            </Panel>
            <Panel header={<p>Cafe/Bar Ratio <BarChartOutlined /></p>} key="2">
                <ColumnPlot data={cafeBarData} />
            </Panel>
            <Panel header={<p>Sports Indicators <LineChartOutlined /></p>} key="3">
                <LineChart label={'Metric'} data={sportsData}/>
            </Panel>
        </Collapse>
    );
}

export default CollapsePanel;