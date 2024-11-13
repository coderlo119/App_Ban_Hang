import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import listingsReducer from "./listings";

const reducers = combineReducers({
  auth: authReducer,
  listing: listingsReducer,
});

const store = configureStore({ reducer: reducers });
export type RootState = ReturnType<typeof store.getState>;
export default store;
