import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import userSlice from "./features/userSlice";
import appApi from "../services/appApi";

// reducers
const reducers = combineReducers({
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blackList: [appApi.reducerPath],
};

// persist store
const persistedReducer = persistReducer(persistConfig, reducers);

// creating store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appApi.middleware],
});
