import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export default function RootLayout(): React.JSX.Element | null {
  const colorScheme = useColorScheme() ?? "light";
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const studentId = await AsyncStorage.getItem("student_id");
      if (studentId === null) {
        router.replace("/(auth)/login");
      }
    };
    checkLogin();
  }, [router]);

  if (!loaded) {
    return null;
  }

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ backgroundColor: "rgba(12, 234, 0, 0.95)" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 17,
          fontWeight: "400",
          color: "black",
        }}
        text2Style={{
          fontSize: 15,
          color: "black",
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ backgroundColor: "rgba(255, 72, 0, 0.93)" }}
        text1Style={{
          fontSize: 17,
          fontWeight: "400",
          color: "black",
        }}
        text2Style={{
          fontSize: 15,
          color: "black",
        }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{ backgroundColor: "rgba(170, 174, 164, 0.96)" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 17,
          fontWeight: "400",
          color: "black",
        }}
        text2Style={{
          fontSize: 15,
          color: "black",
        }}
      />
    ),
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}
