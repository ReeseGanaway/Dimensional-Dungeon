import { createSlice } from "@reduxjs/toolkit";

export const tileMap = createSlice({
  name: "tileMap",
  initialState: { tileMap: [] },
  reducers: {
    addTileMap(state, action) {
      return { ...state, tileMap: [...state.tileMap, action.payload] };
    },
  },
});

export const tileMapActions = tileMap.actions;
