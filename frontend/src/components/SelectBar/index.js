import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'
import { selectVariableRange, setSelectedTopic } from '../../store/reducers/selectBar'

const SelectBar = () => {
    const range = useSelector(selectVariableRange);
    const dispatch = useDispatch()
    useEffect(()=>{
        const selectBox = document.getElementById("livability-variable");
        dispatch(setSelectedTopic(selectBox.options[selectBox.selectedIndex].value))
    },[])
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
                        value="foods"
                    >
                        Foods
                    </option>
                    <option
                        value="weather"
                    >
                        Weather
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