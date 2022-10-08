import { createSlice } from "@reduxjs/toolkit";

const initSave = {
  maps: { grassCanvas: { turnInfo: { turnNum: 0, team: null } } },
};
export const saveData = createSlice({
  name: "saveData",
  initialState: initSave,
  reducers: {
    setSave(state, action) {
      console.log({
        ...state,
        maps: { ...state.maps, [action.payload.map]: action.payload.save },
      });
      return {
        ...state,
        maps: { ...state.maps, [action.payload.map]: action.payload.save },
      };
    },
    clearSave() {
      return initSave;
    },
  },
});

export const saveDataActions = saveData.actions;
