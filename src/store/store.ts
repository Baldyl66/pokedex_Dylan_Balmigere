import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./slices/pokemon-slices";
import { pokemonApi } from "./slices/pokemonApi";

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;