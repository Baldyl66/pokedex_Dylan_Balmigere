import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Trainer } from "../../types";

interface TrainersState {
  trainers: Trainer[];
  activeTrainerId: number | null;
}

const initialState: TrainersState = {
  trainers: [],
  activeTrainerId: null,
};

const trainersSlice = createSlice({
  name: "trainers",
  initialState,
  reducers: {
    // Ajoute un nouveau dresseur
    addTrainer: (state, action: PayloadAction<string>) => {
      if (state.trainers.length < 2) {
        const newTrainer: Trainer = {
          id: Date.now(),
          name: action.payload,
          favorites: [],
        };
        state.trainers.push(newTrainer);
        // Active le premier dresseur créé
        if (state.activeTrainerId === null) {
          state.activeTrainerId = newTrainer.id;
        }
      }
    },

    // Supprime un dresseur
    removeTrainer: (state, action: PayloadAction<number>) => {
      state.trainers = state.trainers.filter((t) => t.id !== action.payload);
      // Si le dresseur supprimé était actif, désactive
      if (state.activeTrainerId === action.payload) {
        state.activeTrainerId = state.trainers.length > 0 ? state.trainers[0].id : null;
      }
    },

    // Définit le dresseur actif
    setActiveTrainer: (state, action: PayloadAction<number | null>) => {
      state.activeTrainerId = action.payload;
    },

    // Ajoute un Pokémon aux favoris du dresseur actif
    toggleFavorite: (state, action: PayloadAction<number>) => {
      if (state.activeTrainerId === null) return;

      const trainer = state.trainers.find((t) => t.id === state.activeTrainerId);
      if (trainer) {
        const index = trainer.favorites.indexOf(action.payload);
        if (index > -1) {
          trainer.favorites.splice(index, 1);
        } else {
          trainer.favorites.push(action.payload);
        }
      }
    },
  },
});

export const { addTrainer, removeTrainer, setActiveTrainer, toggleFavorite } = trainersSlice.actions;
export default trainersSlice.reducer;
