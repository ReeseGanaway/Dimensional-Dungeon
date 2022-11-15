import { createSlice } from "@reduxjs/toolkit";

const initMode = {
  movement: {
    active: false,
  },
  battle: { active: false, currentHero: null },
  teamSelection: { active: true, currentHero: null },
  selectedHero: { hero: null },
};
export const mode = createSlice({
  name: "mode",
  initialState: initMode,
  reducers: {
    setSelectedHero(state, action) {
      return {
        ...state,
        selectedHero: {
          ...state.selectedHero,
          hero: action.payload,
        },
      };
    },
    activateMovement(state) {
      return {
        ...state,
        movement: { ...state.movement, active: true },
      };
    },
    endMovement(state) {
      return {
        ...state,
        movement: { ...state.movement, active: false },
        selectedHero: { ...state.selectedHero, hero: null },
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
        selectedHero: { ...state.selectedHero, hero: null },
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
