import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import AdminNavigator from "./AdminNavigator";
import ShowAllProduct from "@views/ShowAllProduct";
import ShowAllUser from "@views/ShowAllUser";

const Tab = createBottomTabNavigator();
const getOptions = (iconName: string): BottomTabNavigationOptions => {
  return {
    tabBarIcon({ color, size }) {
      return <AntDesign name={iconName as any} size={size} color={color} />;
    },
    title: "",
  };
};

const TabAdminNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="AdminNavigator"
        component={AdminNavigator}
        options={getOptions("home")}
      />
      <Tab.Screen
        name="ManageProdut"
        component={ShowAllProduct}
        options={getOptions("inbox")}
      />
      <Tab.Screen
        name="ManageUser"
        component={ShowAllUser}
        options={getOptions("user")}
      />
    </Tab.Navigator>
  );
};

export default TabAdminNavigator;
