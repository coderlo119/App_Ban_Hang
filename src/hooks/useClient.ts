import { baseURL } from "@api/client";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import useAuth from "./useAuth";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import { runAxiosAsync } from "@api/runAxiosAsync";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState, updateAuthState } from "@store/auth";

const authClient = axios.create({ baseURL });

export type TokenResponse = {
  tokens: {
    refresh: string;
    access: string;
  };
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
};

const useClient = () => {
  const authState = useSelector(getAuthState);
  const dispatch = useDispatch();

  const token = authState.profile?.accessToken;

  authClient.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = async (failedRequest: any) => {
    const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);

    const options = {
      method: "POST",
      data: { refreshToken },
      url: `${baseURL}/auth/refresh-token`,
    };
    const res = await runAxiosAsync<TokenResponse>(axios(options));
    if (res?.tokens) {
      failedRequest.response.config.headers.Authorization =
        "Bearer " + res.tokens.access;
      if (failedRequest.response.config.url === "/auth/sign-out") {
        failedRequest.response.config.data = {
          refreshToken: res.tokens.refresh,
        };
      }
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      dispatch(
        updateAuthState({
          profile: { ...res.profile, accessToken: res.tokens.access },
          pending: false,
        })
      );
      return Promise.resolve();
    }
  };
  createAuthRefreshInterceptor(authClient, refreshAuthLogic);

  return { authClient };
};

export default useClient;
