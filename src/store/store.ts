import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "./slices/pokemon-slices";
import trainersReducer from "./slices/trainers-slices";
import authReducer from "./slices/auth-slices";
import { pokemonApi } from "./slices/pokemonApi";
import { authApi } from "./slices/authApi";

//--- Configuration du store Redux avec les reducers et middleware

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,                      //--- Slice pour la gestion des Pokémons capturés
    trainers: trainersReducer,                    //--- Slice pour la gestion des dresseurs
    auth: authReducer,                            //--- Slice pour l'authentification
    [pokemonApi.reducerPath]: pokemonApi.reducer, //--- API RTK Query pour les Pokémons
    [authApi.reducerPath]: authApi.reducer        //--- API RTK Query pour l'authentification
  },

  //--- Ajout du middleware RTK Query pour gérer les requêtes

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware, authApi.middleware)
});

//--- Types pour TypeScript

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;