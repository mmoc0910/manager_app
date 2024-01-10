import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type AuthState = {
  _id?: string;
  name?: string;
  username?: string;
  address?: string;
  phone?: string;
  role?: 1 | 2;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  accessToken?: string;
};

const initialState: AuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) =>
      action.payload
        ? {
            ...action.payload,
          }
        : {},
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
