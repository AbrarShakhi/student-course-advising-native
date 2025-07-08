import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createActivateStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import { patch, post } from "@/utils/fetch";
import showAlert from "@/utils/showAlert";

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
      showAlert("Error", "Please enter your student ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await patch(SEND_OTP_URL, {
        studentId: studentId,
      });

      setOtpSent(true);
      showAlert("OTP Sent", "Check your email for the OTP.");
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!studentId || !otp || !password) {
      showAlert("Error", "Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await post(ACTIVATE_URL, {
        student_id: studentId,
        password,
        otp,
      });
      showAlert("Success", "Account activated! You can now log in.");
    } catch (error: any) {
      showAlert("Error", error.message || "Activation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Activate Account</Text>
          <Text style={styles.subtitle}>
            Enter your student ID to receive an OTP
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={styles.input}
                value={studentId}
                onChangeText={setStudentId}
                autoCapitalize="none"
                keyboardType="default"
                placeholder="Enter your student ID"
                placeholderTextColor={colors.text + "80"}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Text>
            </TouchableOpacity>
            {otpSent && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>OTP</Text>
                  <TextInput
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    placeholder="Enter OTP"
                    placeholderTextColor={colors.text + "80"}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Enter new password"
                    placeholderTextColor={colors.text + "80"}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleActivate}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Activating..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
