import client from "@api/client";
import { runAxiosAsync } from "@api/runAxiosAsync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthState, updateAuthState } from "@store/auth";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import useClient from "./useClient";

export interface SignInRes {
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
    isAdmin: boolean;
    isActive: boolean;
  };
  tokens: { access: string; refresh: string };
}

type UserInfo = {
  email: string;
  password: string;
};

const useAuth = () => {
  const dispatch = useDispatch();
  const { authClient } = useClient();
  const authState = useSelector(getAuthState);

  const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({ profile: null, pending: true }));
    const res = await runAxiosAsync<SignInRes>(
      client.post("/auth/sign-in", userInfo)
    );
    console.log(res?.profile);

    if (res && res.tokens) {
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      dispatch(
        updateAuthState({
          profile: { ...res.profile, accessToken: res.tokens.access },
          pending: false,
        })
      );
    } else {
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };

  const signOut = async () => {
    const token = await asyncStorage.get(Keys.REFRESH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ profile: authState.profile, pending: true }));
      await runAxiosAsync(
        authClient.post("/auth/sign-out", { refreshToken: token })
      );
      await asyncStorage.remove(Keys.REFRESH_TOKEN);
      await asyncStorage.remove(Keys.AUTH_TOKEN);
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };
  const loggedIn = authState.profile ? true : false;

  return { signIn, signOut, authState, loggedIn };
};

export default useAuth;
