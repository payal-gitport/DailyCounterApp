import { useTheme } from "@/contexts/ThemeContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import FeedbackScreen from "../screens/FeedbackScreen";
import HelpScreen from "../screens/HelpScreen";
import TabNavigator from "./TabNavigator";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{
            headerShown: true,
            headerTitle: "Help",
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{
            headerShown: true,
            headerTitle: "Feedback",
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
