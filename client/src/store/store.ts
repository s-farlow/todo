// Configure Redux store set up
// SOURCE(s): Redux Toolkit Usage Guide [https://redux-toolkit.js.org/usage/usage-guide]
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;