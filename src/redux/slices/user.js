import { createSlice } from "@reduxjs/toolkit";

const initMode = {
  username: null,
  roles: null,
  access_token: null,
  refresh_token: null,
};
export const user = createSlice({
  name: "user",
  initialState: initMode,
  reducers: {
    setUser(state, action) {
      return {
        state: {
          ...state,
          username: action.payload.username,
          roles: action.payload.roles,
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
        },
      };
    },

    resetUser() {
      return initMode;
    },
  },
});

export const userActions = user.actions;
