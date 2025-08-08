import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { createForgotStyles } from "@/styles/global"; // Assuming this is your style factory
import { API_URL } from "@/utils/api";
import { patch } from "@/utils/fetch";

export default function changePassword() {
  const { colors, dark } = useTheme();
  const styles = createForgotStyles(colors, dark);
  const router = useRouter();

  // --- State Management ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the password change process.
   */
  const handlePasswordChange = async () => {
    // --- 1. Client-Side Validation ---
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all fields.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords Mismatch",
        text2: "Your new passwords do not match.",
      });
      return;
    }
    if (newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Password Too Short",
        text2: "New password must be at least 8 characters.",
      });
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // --- 2. Get Auth Token ---
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Authentication Error",
          text2: "Please log in again.",
        });
        router.replace("/(auth)/login");
        return;
      }

      // --- 3. Make API Call ---
      const response = await patch(
        `${API_URL}/change-password`,
        { old_password: oldPassword, new_password: newPassword },
        token // Pass the token for authentication
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Your password has been updated successfully.",
      });

      // --- 4. Handle Success ---
      // For security, log the user out after a password change.
      await AsyncStorage.clear();
      router.replace("/(auth)/login");
    } catch (error: any) {
      // --- 5. Handle Errors ---
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* --- Header Section --- */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.title}>Change Password</Text>
              <Text style={styles.subtitle}>
                Your new password must be different from the previous one.
              </Text>
            </View>

            {/* --- Form Section --- */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Old Password"
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
                style={[
                  styles.button,
                  { backgroundColor: colors.primary },
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handlePasswordChange}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
