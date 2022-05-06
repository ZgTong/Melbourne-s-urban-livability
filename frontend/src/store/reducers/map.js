import { createSlice } from "@reduxjs/toolkit";

const MapSlice = createSlice({
    name: "map",
    initialState:{
        readyFlag: false
    },
    reducers:{
        setReadyFlag: (state, action)=>{
            state.readyFlag =  action.payload.flag
        },
    }
})
export const { setReadyFlag } = MapSlice.actions
export const readyFlagSelector = (state) => state.map.readyFlag
export default MapSlice.reducer
