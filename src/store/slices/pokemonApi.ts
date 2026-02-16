import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pokemon } from '../../types';

//--- API RTK Query pour gérer les requêtes HTTP vers l'API Pokémon

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://tyradex.app/api/v1'
  }),
  endpoints: (builder) => ({

    //--- Récupère la liste de tous les Pokémons avec cache automatique

    getPokemon: builder.query<Pokemon[], void>({
      query: () => '/pokemon',
      transformResponse: (response: Pokemon[]) => {

        //--- Filtre le Pokémon avec ID 0 (invalide)

        return response.filter(pokemon => pokemon.pokedex_id !== 0);
      }
    }),

    //--- Récupère les détails d'un Pokémon spécifique par ID

    getPokemonById: builder.query<Pokemon, number>({
      query: (id) => `/pokemon/${id}`
    })
  })
});

export const { useGetPokemonQuery, useGetPokemonByIdQuery } = pokemonApi;
