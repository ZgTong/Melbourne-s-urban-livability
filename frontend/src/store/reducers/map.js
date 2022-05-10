import { createSlice } from "@reduxjs/toolkit";

const MapSlice = createSlice({
    name: "map",
    initialState:{
        readyFlag: false,
        sceneData: {}
    },
    reducers:{
        setReadyFlag: (state, action)=>{
            state.readyFlag =  action.payload.flag
        },
        addData: (state, action)=>{
            state.sceneData[action.payload.topic][action.payload.year] = action.payload.data
        }
    }
})
export const { setReadyFlag, addData } = MapSlice.actions
export const readyFlagSelector = (state) => state.map.readyFlag
export const sceneDataSelector = (state) => state.map.sceneData
export default MapSlice.reducer
