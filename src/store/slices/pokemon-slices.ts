import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// État pour les Pokémons capturés par l'utilisateur
interface PokemonCapturedState {
  capturedPokemonIds: number[];
}

const initialState: PokemonCapturedState = {
  capturedPokemonIds: [],
};

// Redux slice pour gérer les actions liées aux captures de Pokémons
const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    // Ajoute un Pokémon à la liste des capturés
    addCapturedPokemon: (state, action: PayloadAction<number>) => {
      state.capturedPokemonIds.push(action.payload);
    },
    // Retire un Pokémon de la liste des capturés
    removeCapturedPokemon: (state, action: PayloadAction<number>) => {
      state.capturedPokemonIds = state.capturedPokemonIds.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const { addCapturedPokemon, removeCapturedPokemon } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;