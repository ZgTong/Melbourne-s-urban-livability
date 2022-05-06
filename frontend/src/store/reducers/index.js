import {combineReducers} from '@reduxjs/toolkit'
import MapSlice from './map'
import SelectBarSlice from "./selectBar"

const rootReducers = combineReducers({
    map: MapSlice,
    selectBar: SelectBarSlice
})
export default rootReducers