import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./slice/AuthSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

export default store;
