import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import casesReducer from "./casesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cases: casesReducer,
  },
});

export default store;
