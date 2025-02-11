import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dbFlag: null,
    price: 0,
    winnerCount: 0,
    profit: 0,
    sealedAmount: 0,
    finishFlag: false,
    boardType: {},
    boardSquares: [],
    curSettingID: null,
};

export const SettingSlice = createSlice({
    name: "settingSlice",
    initialState,
    reducers: {
        settingAction: (state, { payload }) => {
            state[payload['type']] = payload['data'];
        }
    }
});

export const { settingAction } = SettingSlice.actions;
export default SettingSlice.reducer;
