import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sealedList: []
};

export const SealedSlice = createSlice({
    name: "sealedSlice",
    initialState,
    reducers: {
        sealedAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        }
    }
});

export const { sealedAction } = SealedSlice.actions;
export default SealedSlice.reducer;
