import { createSlice } from "@reduxjs/toolkit";

const initMode = {
  movement: { active: false, currentHero: null },
  battle: { active: false, currentHero: null },
};
export const mode = createSlice({
  name: "mode",
  initialState: initMode,
  reducers: {
    toggleMovement(state, action) {
      return { ...state, movement: action.payload };
    },
    endMovement(state) {
      return {
        ...state,
        movement: { ...state.movement, active: false, currentHero: null },
      };
    },
    resetMode() {
      return initMode;
    },
  },
});

export const modeActions = mode.actions;
