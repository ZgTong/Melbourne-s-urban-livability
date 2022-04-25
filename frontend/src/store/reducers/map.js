import { createSlice } from "@reduxjs/toolkit";

const MapSlice = createSlice({
    name: "map",
    initialState:{
        map: null,
    },
    reducers:{
        initMap: (state, action)=>{
            console.log("slice:", action)
            state.map = new window.google.maps.Map(action.payload.ele, {zoom:action.payload.zoom, center: action.payload.center, styles: action.payload.styles})
        }
    }
})
export const createMap = (options) => (dispatch) => {
    dispatch(initMap(options))
}
export const { initMap } = MapSlice.actions
export const mapSelector = (state) => state.map.value
export default MapSlice.reducer
