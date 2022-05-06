import { createSlice } from "@reduxjs/toolkit";

const SelectBarSlice = createSlice({
    name: "selectBar",
    initialState:{
        variableRange:{
            variableMin: Number.MAX_VALUE,
            variableMax: -Number.MAX_VALUE,
        },
    },
    reducers:{
        setVariableRange: (state, action) => {
            state.variableRange = action.payload;
        },
    }
})
export const { setVariableRange } = SelectBarSlice.actions
export const selectVariableRange = (state) => {
    return state.selectBar.variableRange}
export default SelectBarSlice.reducer
