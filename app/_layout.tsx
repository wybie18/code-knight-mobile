import AchievementToast from "@/components/AchievementToast";
import { AuthProvider } from "@/context/AuthContext";
import { useAchievementListener } from "@/hooks/useAchievementListener";
import { useAuth } from "@/hooks/useAuth";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import "../styles/global.css";

const toastConfig = {
  achievementToast: ({ props }: any) => (
    <AchievementToast event={props.event} />
  ),
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#22c55e' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  )
};

const InitialLayout = () => {
  const { isAuthenticated, user } = useAuth();
  
  useAchievementListener(user?.id);

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
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
