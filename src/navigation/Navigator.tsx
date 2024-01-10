import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import LoginScreen from "../screens/LoginScreen";
import SignInScreen from "../screens/SignInScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddClassScreen from "../screens/AddClassScreen";
import HeaderCustom from "../components/HeaderCustom";
import ClassDetailScreen from "../screens/ClassDetailScreen";
import AddStudentScreen from "../screens/AddStudentScreen";
import AddExamScreen from "../screens/AddExamScreen";
import DoExamScreen from "../screens/DoExamScreen";
import ResultExamScreen from "../screens/ResultExamScreen";
import ChatScreen from "../screens/ChatScreen";
import StatisticalScoreScreen from "../screens/StatisticalScoreScreen";

const Stack = createStackNavigator<RootStackParamList>();

const Navigator = () => {
  const auth = useSelector((state: RootState) => state.auth);
  console.log("auth - ", auth);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="AddClass"
        component={AddClassScreen}
        options={{
          header: ({ back }) => (
            <HeaderCustom back={back} title={"Thêm lớp học"} />
          ),
        }}
      />
      <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      <Stack.Screen name="AddExam" component={AddExamScreen} />
      <Stack.Screen name="DoExam" component={DoExamScreen} />
      <Stack.Screen name="ResultExam" component={ResultExamScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen
        name="StatisticalScore"
        component={StatisticalScoreScreen}
      />
      <Stack.Screen
        name="LogIn"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
