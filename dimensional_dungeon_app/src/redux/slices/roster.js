import { createSlice } from "@reduxjs/toolkit";
import { initialRoster } from "./initialRoster";

export const roster = createSlice({
  name: "roster",
  initialState: initialRoster,
  reducers: {
    addHero(state, action) {
      const { name, spriteSheet, x, y } = action.payload;

      if (name != null && spriteSheet != null && x != null && y != null) {
        return { ...state, [action.payload.name]: action.payload };
      }
    },
    updateXY(state, action) {
      const name = action.payload.name;
      if (name !== undefined) {
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
    resetRoster(state, action) {
      return initialRoster;
    },
  },
});

export const rosterActions = roster.actions;
