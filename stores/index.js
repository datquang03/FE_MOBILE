import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Authentication/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export default store;

