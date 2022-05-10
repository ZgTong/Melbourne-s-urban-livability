import { createSlice } from "@reduxjs/toolkit";

const SelectBarSlice = createSlice({
    name: "selectBar",
    initialState:{
        selectedTopic: null,
        variableRange:{
            variableMin: Number.MAX_VALUE,
            variableMax: -Number.MAX_VALUE,
        },
    },
    reducers:{
        setVariableRange: (state, action) => {
            state.variableRange = action.payload;
        },
        setSelectedTopic: (state, action) => {
            state.selectedTopic = action.payload;
        },
    }
})
export const { setVariableRange, setSelectedTopic } = SelectBarSlice.actions
export const selectVariableRange = (state) => {
    return state.selectBar.variableRange}
export const selectSelectedTopic = (state) => {
    return state.selectBar.selectedTopic}
export default SelectBarSlice.reducer
