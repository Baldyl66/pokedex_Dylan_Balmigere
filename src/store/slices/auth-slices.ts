import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  accessToken: string | null;
  user: {
    username: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    //--- Définir le token et l'utilisateur après login

    setAuth: (state, action: PayloadAction<{ accessToken: string; user: { username: string; role: string } }>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },

    //--- Renouveler le token (refresh)

    refreshToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    //--- Déconnecter l'utilisateur

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    //--- Gérer les erreurs

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    //--- Gérer l'état de chargement
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setAuth, refreshToken, logout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;
