import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pokemon } from '../../types';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://tyradex.vercel.app/api/v1'
  }),
  endpoints: (builder) => ({
    getPokemon: builder.query<Pokemon[], void>({
      query: () => '/pokemon',
      transformResponse: (response: Pokemon[]) => {
        return response.filter(pokemon => pokemon.pokedex_id !== 0);
      }
    }),
    getPokemonById: builder.query<Pokemon, number>({
      query: (id) => `/pokemon/${id}`
    })
  })
});

export const { useGetPokemonQuery, useGetPokemonByIdQuery } = pokemonApi;
