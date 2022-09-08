import { createSlice } from "@reduxjs/toolkit";
import { Action } from "history";

export const roster = createSlice({
  name: "roster",
  initialState: {},
  reducers: {
    addHero(state, action) {
      const { name, spriteSheet, x, y } = action.payload;

      if (name != null && spriteSheet != null && x != null && y != null) {
        return { ...state, [action.payload.name]: action.payload };
      }
    },
    updateXY(state, action) {
      const name = action.payload.name;
      if (name != undefined) {
        return {
          ...state,
          [name]: {
            ...state[name],
            x: action.payload.x,
            y: action.payload.y,
          },
        };
      }
    },
    clearRoster(state, action) {
      return {};
    },
  },
});

export const rosterActions = roster.actions;
