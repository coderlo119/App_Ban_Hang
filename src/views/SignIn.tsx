import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import FormInput from "@Ui/FormInput";
import WelcomeHeader from "@Ui/WelcomeHeader";
import AppButton from "@Ui/AppButton";
import FormDivider from "@Ui/FormDivider";
import FormNavigator from "@Ui/FormNavigator";
import CustomKeyAvoidingView from "@Ui/CustomKeyAvoidingView";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@navigator/AuthNavigator";
import { signInSchema, yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import { runAxiosAsync } from "@api/runAxiosAsync";
import client from "@api/client";
import { useDispatch } from "react-redux";
import { updateAuthState } from "@store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "src/hooks/useAuth";

interface Props {}

const SignIn: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const { signIn } = useAuth();

  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);

    if (error) return showMessage({ message: error, type: "danger" });

    if (values) signIn(values);
  };

  const handleChange = (name: string) => (text: string) =>
    setUserInfo({ ...userInfo, [name]: text });

  const { email, password } = userInfo;

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleChange("email")}
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />
          <AppButton title="Đăng nhập" onPress={handleSubmit} />
          <FormDivider />
          <FormNavigator
            onLeftPress={() => navigate("ForgetPassword")}
            onRightPress={() => navigate("SignUp")}
            leftTitle="Quên mật khẩu"
            rightTitle="Đăng kí"
          />
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  innerContainer: {
    padding: 15,
    flex: 1,
  },

  formContainer: {
    marginTop: 30,
  },
});

export default SignIn;
