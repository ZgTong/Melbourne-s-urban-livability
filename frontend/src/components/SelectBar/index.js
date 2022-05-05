import React from 'react';
import './index.scss'

const SelectBar = () => {
    return (
        <div id="controls" className="nicebox">
            <div>
                <select id="livability-variable">
                    <option
                        value="https://storage.googleapis.com/mapsdevsite/json/DP02_0066PE"
                    >
                        Percent of population over 25 that completed high school
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
                <div id="livability-min">min</div>
                <div className="color-key"><span id="data-caret">&#x25c6;</span></div>
                <div id="livability-max">max</div>
            </div>
        </div>
    );
};

export default SelectBar;