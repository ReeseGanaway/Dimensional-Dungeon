import { createSlice } from "@reduxjs/toolkit";

const initSave = {
  maps: { grassCanvas: { turnInfo: { turnNum: 0, team: null } } },
};
export const saveData = createSlice({
  name: "saveData",
  initialState: initSave,
  reducers: {
    setSave(state, action) {
      return {
        ...state,
        maps: { ...state.maps[action.map], [action.map]: action.save },
      };
    },
    clearSave() {
      return initSave;
    },
  },
});

export const saveDataActions = saveData.actions;
