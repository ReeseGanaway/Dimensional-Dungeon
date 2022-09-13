import { createSlice } from "@reduxjs/toolkit";
import { initialRoster } from "./initialStateConstants";

export const roster = createSlice({
  name: "roster",
  initialState: initialRoster,
  reducers: {
    addHeroCollection(state, action) {
      const { name, spriteSheet } = action.payload;

      if (name != null && spriteSheet != null) {
        return {
          ...state,
          collection: {
            ...state.collection,
            [action.payload.name]: action.payload,
          },
        };
      }
    },
    addHeroActive(state, action) {
      const { name, spriteSheet } = action.payload;

      if (name != null && spriteSheet != null) {
        return {
          ...state,
          activeRoster: {
            ...state.activeRoster,
            [action.payload.name]: action.payload,
          },
        };
      }
    },
    deleteActiveHero(state, action) {
      let newState = { ...state };
      delete newState.activeRoster[action.payload];
      return void newState;
    },
    resetActiveHeroes(state, action) {
      return {
        ...state,
        activeRoster: {},
      };
    },
    updateXY(state, action) {
      const name = action.payload.name;
      if (name !== undefined) {
        return {
          ...state,
          activeRoster: {
            ...state.activeRoster,
            [name]: {
              ...state.activeRoster[name],
              x: action.payload.x,
              y: action.payload.y,
            },
          },
        };
      }
    },
    clearRoster(state, action) {
      return {};
    },
    resetRoster(state, action) {
      return initialRoster;
    },
  },
});

export const rosterActions = roster.actions;
