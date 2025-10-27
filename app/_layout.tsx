import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "../styles/global.css";

const InitialLayout = () => {
  const {isAuthenticated} = useAuth();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)"/>
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
      </Stack.Protected>
      <Stack.Screen name="loading"/>
    </Stack>
  );
};

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);
  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
