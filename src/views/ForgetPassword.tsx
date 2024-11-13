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
import { emailRegex } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import client from "@api/client";
import { runAxiosAsync } from "@api/runAxiosAsync";

interface Props {}

const ForgetPassword: FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      return showMessage({ message: "Email không hợp lệ", type: "danger" });
    }
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/forget-pass", { email })
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };
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
            onChangeText={(text) => setEmail(text)}
          />
          <AppButton
            active={!busy}
            title={busy ? "Hãy đợi..." : "Gởi yêu cầu"}
            onPress={handleSubmit}
          />
          <FormDivider />
          <FormNavigator
            onLeftPress={() => navigate("SignUp")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Đăng kí"
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

export default ForgetPassword;
