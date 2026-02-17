import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./slices/pokemon-slices";
import trainersReducer from "./slices/trainers-slices";
import { pokemonApi } from "./slices/pokemonApi";

//--- Configuration du store Redux avec les reducers et middleware

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,                      //--- Slice pour la gestion des Pokémons capturés
    trainers: trainersReducer,                    //--- Slice pour la gestion des dresseurs
    [pokemonApi.reducerPath]: pokemonApi.reducer //--- API RTK Query
  },

  //--- Ajout du middleware RTK Query pour gérer les requêtes

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware)
});

//--- Types pour TypeScript

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;