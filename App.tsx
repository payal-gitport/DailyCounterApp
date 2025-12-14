import React from "react";
import { StatusBar } from "react-native";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </ThemeProvider>
  );
}
