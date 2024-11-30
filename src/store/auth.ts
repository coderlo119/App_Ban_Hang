import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export type Profile = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  avatar?: string;
  isAdmin: boolean;
  isActive: boolean;
  accessToken: string;
};

interface AuthState {
  profile: null | Profile;
  pending: boolean;
}

const initialState: AuthState = {
  pending: false,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthState(authstate, { payload }: PayloadAction<AuthState>) {
      authstate.pending = payload.pending;
      authstate.profile = payload.profile;
    },
  },
});

export const { updateAuthState } = authSlice.actions;

export const getAuthState = createSelector(
  (state: RootState) => state,
  (state) => state.auth
);

export default authSlice.reducer;
