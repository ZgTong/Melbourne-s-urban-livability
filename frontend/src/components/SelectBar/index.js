import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'
import { selectVariableRange } from '../../store/reducers/selectBar'

const SelectBar = () => {
    const range = useSelector(selectVariableRange);
    return (
        <div id="controls" className="nicebox">
            <div>
                <select id="livability-variable">
                    <option
                        value="sports"
                    >
                        Sports
                    </option>
                    <option
                        value="https://storage.googleapis.com/mapsdevsite/json/DP05_0017E"
                    >
                        Median age
                    </option>
                    <option
                        value="https://storage.googleapis.com/mapsdevsite/json/DP05_0001E"
                    >
                        Total population
                    </option>
                    <option
                        value="https://storage.googleapis.com/mapsdevsite/json/DP02_0016E"
                    >
                        Average family size
                    </option>
                    <option
                        value="https://storage.googleapis.com/mapsdevsite/json/DP03_0088E"
                    >
                        Per-capita income
                    </option>
                </select>
            </div>
            <div id="legend">
                <div id="livability-min">{range.variableMin.toFixed(2).toLocaleString()}</div>
                <div className="color-key"><span id="data-caret">&#x25c6;</span></div>
                <div id="livability-max">{range.variableMax.toFixed(2).toLocaleString()}</div>
            </div>
        </div>
    );
};

export default SelectBar;