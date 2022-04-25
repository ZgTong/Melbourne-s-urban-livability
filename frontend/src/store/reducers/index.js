import {combineReducers} from '@reduxjs/toolkit'
import MapSlice from './map'
const rootReducers = combineReducers({
    map: MapSlice
})
export default rootReducers