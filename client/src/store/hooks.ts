// Configure hooks to interact with Redux store.
// SOURCE(s): Redux Toolkit Usage Guide [https://redux-toolkit.js.org/usage/usage-guide]

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// dispach hook to send instructions to store (ex. to be used in place of full functions in App.tsx)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;