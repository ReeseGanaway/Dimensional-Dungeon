import { createSlice } from "@reduxjs/toolkit";

export const mode = createSlice({
  name: "mode",
  initialState: {
    movement: { active: false, currentHero: null },
    battle: { active: false, currentHero: null },
  },
  reducers: {
    toggleMovement(state, action) {
      return { ...state, movement: action.payload };
    },
  },
});

export const modeActions = mode.actions;
