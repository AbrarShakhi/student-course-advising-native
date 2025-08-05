import { createLoginStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import { post } from "@/utils/fetch";
import showAlert from "@/utils/showAlert";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LOGIN_URL = `${API_URL}/login`;

export default function LoginScreen() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { colors, dark } = useTheme();

  const styles = createLoginStyles(colors, dark);

  const handleLogin = async () => {
    if (!studentId || !password) {
      showAlert("Info", "Please fill all fields.", "info");
      return;
    }

    setLoading(true);
    try {
      const response = await post<{ access_token: string }>(LOGIN_URL, {
        student_id: studentId,
        password: password,
      });

      // Navigate to the home screen and pass the token and student ID
      // directly as parameters. This ensures the home screen receives them immediately.
      router.replace({
        pathname: "/",
        params: {
          accessToken: response.access_token,
          studentId: studentId,
        },
      });
    } catch (error: any) {
      // Catch specific 401/403 errors and display a helpful message
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        showAlert("Error", "Invalid student ID or password.", "error");
      } else {
        showAlert(
          "Error",
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "space-between" }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={studentId}
            onChangeText={setStudentId}
            autoCapitalize="none"
            keyboardType="default"
            placeholder="Student ID"
            placeholderTextColor={colors.text + "80"}
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor={colors.text + "80"}
          />
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => {
              router.push("/(auth)/forgot");
            }}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[
                "rgba(42,123,155,1)",
                "rgba(87,135,217,1)",
                "rgba(87,193,199,1)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/activate")}
          >
            <Text style={styles.secondaryButtonText}>Activate Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
