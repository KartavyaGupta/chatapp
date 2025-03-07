import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RoomsListScreen from "./screens/RoomsListScreen";
import CreateRoomScreen from "./screens/CreateRoomScreen";
import ChatScreen from "./screens/ChatScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomsList"
          component={RoomsListScreen}
          options={{ title: "", headerLeft: () => null }}
        />
        <Stack.Screen
          name="CreateRoom"
          component={CreateRoomScreen}
          options={{ title: "", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
        options={{ title: "", headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
