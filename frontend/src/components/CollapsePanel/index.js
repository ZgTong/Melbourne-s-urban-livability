import React, {useState} from 'react';
import { Collapse } from 'antd';
import './index.scss'
import LineChart from "../LineChart";
import PieChart from "../../components/PieChart";
import { GetWeather } from "../../api";

const { Panel } = Collapse;

function CollapsePanel() {
    const [weatherData, setWeatherData] = useState({"UVmetrics":[],"Tempmetrics":[],"Windmetrics":[],"HumidMetrics":[]});
    function callbackLevel1(key) {
        console.log("level1:", key);
        if(key === "1"){
            GetWeather().then((res) => {
                console.log(res)
                setWeatherData(res)
            })
        } else if(key === "3"){
        } else if(key === "4"){
        }
    }

    function callbackLevel2(key) {
        console.log("level2:", key);
    }

    const text = `
      A dog is a type of domesticated animal.
      Known for its loyalty and faithfulness,
      it can be found as a welcome guest in many households across the world.
    `;
    return (
        <Collapse onChange={callbackLevel1} accordion ghost>
            <Panel header="Weather" key="1">
                <Collapse onChange={callbackLevel2} accordion ghost>
                    <Panel header="UVmetrics" key="11">
                        <LineChart label={'UVmetrics'} data={weatherData['UVmetrics']}/>
                    </Panel>
                    <Panel header="Tempmetrics" key="12">
                        <LineChart label={'Tempmetrics'} data={weatherData['Tempmetrics']}/>
                    </Panel>
                    <Panel header="WindMetrics" key="13">
                        <LineChart label={'WindMetrics'} data={weatherData['WindMetrics']}/>
                    </Panel>
                    <Panel header="HumidMetrics" key="14">
                        <LineChart label={'HumidMetrics'} data={weatherData['HumidMetrics']}/>
                    </Panel>
                </Collapse>
            </Panel>
            <Panel header="This is PieChart" key="2">
                <PieChart />
            </Panel>
            <Panel header="This is panel header 3" key="3">
                <p>{text}</p>
            </Panel>
        </Collapse>
    );
}

export default CollapsePanel;