import { createSlice } from "@reduxjs/toolkit";
import { Action } from "history";

export const roster = createSlice({
  name: "roster",
  initialState: {},
  reducers: {
    addHero(state, action) {
      console.log(action.payload);
      const { name, imgLink, x, y } = action.payload;

      if (name != null && imgLink != null && x != null && y != null) {
        console.log("here");
        return { ...state, [action.payload.name]: action.payload };
      }
    },
    updateXY(state, action) {
      const name = action.payload.name;
      if (name != undefined) {
        console.log("updating");
        return {
          ...state,
          [action.payload.name]: {
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
