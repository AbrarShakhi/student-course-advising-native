import { createActivateStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import { APIError, patch, post } from "@/utils/fetch";
import showAlert from "@/utils/showAlert";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

const SEND_OTP_URL = `${API_URL}/send-otp?reason_id=2`;
const ACTIVATE_URL = `${API_URL}/activate`;

export default function ActivateScreen() {
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { colors, dark } = useTheme();

  const styles = createActivateStyles(colors, dark);

  const handleSendOtp = async () => {
    if (!studentId) {
      showAlert("Error", "Please enter your student ID.", "error");
      return;
    }
    setLoading(true);
    try {
      await patch(
        SEND_OTP_URL,
        {
          student_id: studentId,
        },
        null
      );

      setOtpSent(true);
      // Use a more specific success message based on the backend response
      showAlert(
        "Success",
        "OTP sent successfully. Check your email.",
        "success"
      );
    } catch (error: any) {
      if (error instanceof APIError) {
        // Use the specific error message from the backend
        showAlert("Error", error.message, "error");
      } else {
        // Fallback for network or other unexpected errors
        showAlert("Error", "Failed to send OTP. Please try again.", "error");
      }
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!studentId || !otp || !password) {
      showAlert("Error", "Please fill all fields.", "error");
      return;
    }
    setLoading(true);
    try {
      await post(
        ACTIVATE_URL,
        {
          student_id: studentId,
          password,
          otp,
        },
        null
      );
      showAlert("Success", "Account activated! You can now log in.", "success");
      setStudentId("");
      setOtp("");
      setPassword("");
      router.replace("/(auth)/login");
    } catch (error: any) {
      if (error instanceof APIError) {
        showAlert("Error", error.message, "error");
      } else {
        showAlert("Error", "Activation failed. Please try again.", "error");
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Activate Account</Text>
          <Text style={styles.subtitle}>
            Enter your student ID to receive an OTP
          </Text>
        </View>

        <View style={styles.formContainer}>
          {!otpSent ? (
            <>
              <TextInput
                style={styles.input}
                value={studentId}
                className="student-id-input"
                onChangeText={setStudentId}
                autoCapitalize="none"
                keyboardType="default"
                placeholder="Enter your student ID"
                placeholderTextColor={colors.text + "80"}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOtp}
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
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            otpSent && (
              <>
                <TextInput
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  placeholder="Enter OTP"
                  placeholderTextColor={colors.text + "80"}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                  placeholderTextColor={colors.text + "80"}
                />
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleActivate}
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
                      {loading ? "Activating..." : "Submit"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
