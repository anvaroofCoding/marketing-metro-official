import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api"; // API faylni keyin yaratamiz
import modal from "../services/modalSplice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    modal,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});
