import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
// Import Stack for header options
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createChangePasswordStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import { APIError, patch } from "@/utils/fetch";
import showAlert from "@/utils/showAlert";

const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("access_token");
};

export default function ChangePasswordScreen() {
  const { colors, dark } = useTheme();
  const styles = createChangePasswordStyles(colors, dark);
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showAlert(
        "Missing Fields",
        "Please fill in all password fields.",
        "error"
      );
      return;
    }
    if (newPassword.length < 8) {
      showAlert(
        "Password Too Short",
        "The new password must be at least 8 characters long.",
        "error"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert(
        "Passwords Do Not Match",
        "Please re-enter your new password.",
        "error"
      );
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        showAlert(
          "Authentication Error",
          "You are not logged in. Please log in again.",
          "error"
        );
        router.replace("/(auth)/login");
        setIsLoading(false);
        return;
      }

      await patch(
        `${API_URL}/change-password`,
        { old_password: oldPassword, new_password: newPassword },
        token
      );

      showAlert(
        "Password Updated",
        "You will now be logged out for security.",
        "success"
      );

      await AsyncStorage.clear();
      router.replace("/(auth)/login");
    } catch (error: any) {
      if (error instanceof APIError) {
        showAlert("Update Failed", error.message, "error");
      } else {
        showAlert("Update Failed", "An unexpected error occurred.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View
          style={styles.container}
          onStartShouldSetResponder={() => true}
          onResponderRelease={Keyboard.dismiss}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back-outline"
                size={28}
                color={colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Your new password must be at least 8 characters long.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor={colors.text + "80"}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={colors.text + "80"}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={colors.text + "80"}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handlePasswordChange}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>

          <View />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
