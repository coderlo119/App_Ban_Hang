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
import { newUserSchema, yupValidate } from "@utils/validator";
import { runAxiosAsync } from "src/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import client from "@api/client";
import useAuth from "@hooks/useAuth";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();

  const handleChange = (name: string) => (text: string) =>
    setUserInfo({ ...userInfo, [name]: text });
  const handleSubmit = async () => {
    const { values, error } = await yupValidate(newUserSchema, userInfo);

    if (error) return showMessage({ message: error, type: "danger" });

    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/sign-up", values)
    );
    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
      signIn(values!);
    }
    setBusy(false);
  };

  const { email, name, password } = userInfo;
  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Name"
            value={name}
            onChangeText={handleChange("name")}
          />
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
          <AppButton active={!busy} title="Đăng kí" onPress={handleSubmit} />
          <FormDivider />
          <FormNavigator
            onLeftPress={() => navigate("ForgetPassword")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Quên mật khẩu"
            rightTitle="Đăng nhập"
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

export default SignUp;
