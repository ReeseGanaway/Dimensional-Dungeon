import { createSlice } from "@reduxjs/toolkit";

const initSave = {
  maps: { grassCanvas: { turnInfo: { turnNum: 0 } } },
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
  },
});

export const saveDataActions = saveData.actions;
