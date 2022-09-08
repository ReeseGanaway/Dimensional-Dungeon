import { createSlice } from "@reduxjs/toolkit";

const initMode = {
  movement: { active: false, currentHero: null },
  battle: { active: false, currentHero: null },
  teamSelection: { active: false },
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
    activateTeamSelection(state) {
      return {
        ...state,
        teamSelection: { ...state.teamSelection, active: true },
      };
    },
    deactivateTeamSelection(state) {
      return {
        ...state,
        teamSelection: { ...state.teamSelection, active: false },
      };
    },
    resetMode() {
      return initMode;
    },
  },
});

export const modeActions = mode.actions;
