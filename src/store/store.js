import { configureStore } from "@reduxjs/toolkit";
import SettingSlice from "../features/SettingSlice";
import SealedSlice from "../features/SealedSlice";

export const store = configureStore({
    reducer: {
        setting: SettingSlice,
        sealed: SealedSlice
    }
});