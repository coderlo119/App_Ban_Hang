import { StyleSheet } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import colors from "@utils/color";
import { FC, useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import { useDispatch } from "react-redux";
import { updateAuthState } from "@store/auth";
import { runAxiosAsync } from "@api/runAxiosAsync";
import LoadingSpinner from "@Ui/LoadingSpinner";
import useAuth from "@hooks/useAuth";
import TabNavigator from "./TabNavigator";
import useClient from "@hooks/useClient";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import TabAdminNavigator from "./TabAdminNavigator";

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};
export type ProfileRes = {
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    isAdmin: boolean;
    isActive: boolean;
    avatar?: string;
  };
};
interface Props {}

const Navigator: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { loggedIn, authState } = useAuth();
  const { authClient } = useClient();

  const fetchAuthState = async () => {
    const token = await asyncStorage.get(Keys.AUTH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<ProfileRes>(
        authClient.get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      );
      if (res) {
        dispatch(
          updateAuthState({
            pending: false,
            profile: { ...res.profile, accessToken: token },
          })
        );
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <LoadingSpinner visible={authState.pending} />
      {!loggedIn ? (
        <AuthNavigator />
      ) : !authState.profile?.isAdmin ? (
        <TabNavigator />
      ) : (
        <TabAdminNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Navigator;
