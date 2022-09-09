import { createSlice } from "@reduxjs/toolkit";

const initMode = {
  movement: { active: false, currentHero: null },
  battle: { active: false, currentHero: null },
  teamSelection: { active: false, currentHero: null },
  selectedHero: { hero: null },
};
export const mode = createSlice({
  name: "mode",
  initialState: initMode,
  reducers: {
    toggleMovement(state, action) {
      return { ...state, movement: action.payload };
    },
    setSelectedHero(state, action) {
      return {
        ...state,
        selectedHero: {
          ...state.selectedHero,
          hero: action.payload,
        },
      };
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
        teamSelection: {
          ...state.teamSelection,
          active: false,
          currentHero: null,
        },
      };
    },
    resetTeamSelection(state) {
      return {
        ...state,
        teamSelection: {
          ...state.teamSelection,
          active: false,
          currentHero: null,
        },
      };
    },
    setTeamSelectionHero(state, action) {
      return {
        ...state,
        teamSelection: {
          ...state.teamSelection,
          currentHero: action.payload,
        },
      };
    },
    activateBattle(state) {
      return {
        ...state,
        battle: { ...state.battle, active: true },
      };
    },
    deactivateBattle(state) {
      return {
        ...state,
        battle: { ...state.battle, active: false },
      };
    },
    resetMode() {
      return initMode;
    },
  },
});

export const modeActions = mode.actions;
