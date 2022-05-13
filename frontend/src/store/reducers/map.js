import { createSlice } from "@reduxjs/toolkit";

const MapSlice = createSlice({
    name: "map",
    initialState:{
        appReadyFlag: false,
        readyFlag: false,
        sceneData: {}
    },
    reducers:{
        setAppReadyFlag: (state, action)=>{
            state.appReadyFlag =  action.payload.flag
        },
        setReadyFlag: (state, action)=>{
            state.readyFlag =  action.payload.flag
        },
        addData: (state, action)=>{
            state.sceneData[action.payload.topic][action.payload.year] = action.payload.data
        }
    }
})
export const { setAppReadyFlag, setReadyFlag, addData } = MapSlice.actions
export const readyFlagSelector = (state) => state.map.readyFlag
export const appReadyFlagSelector = (state) => state.map.appReadyFlag
export const sceneDataSelector = (state) => state.map.sceneData
export default MapSlice.reducer
