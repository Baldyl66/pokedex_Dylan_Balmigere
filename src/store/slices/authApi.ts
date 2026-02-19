import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    username: string;
    role: string;
  };
}

export interface RefreshResponse {
  accessToken: string;
}

export interface ProfileResponse {
  message: string;
  user: {
    sub: string;
    username: string;
    role: string;
  };
}

//--- API RTK Query pour l'authentification

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include', //--- Envoie les cookies (refreshToken) automatiquement
    prepareHeaders: (headers, { getState }) => {
      //--- Ajouter le token Bearer à chaque requête
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({

    //--- Login : envoie credentials et récupère accessToken + refreshToken

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials
      })
    }),

    //--- Refresh : renouvelle l'accessToken en utilisant le refreshToken du cookie

    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST'
      })
    }),

    //--- Logout : supprime la session

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST'
      })
    }),

    //--- Profile : récupère les infos de l'utilisateur connecté (route protégée)

    getProfile: builder.query<ProfileResponse, string>({
      query: (accessToken) => ({
        url: '/profile',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    })
  })
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation, useGetProfileQuery } = authApi;
