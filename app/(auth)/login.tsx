import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { createLoginStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import showAlert from "@/utils/showAlert";


const LOGIN_URL = `${API_URL}/login`;

export default function LoginScreen() {
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { colors, dark } = useTheme();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ student_id: studentId, password }),
            });

            if (response.ok) {
                await AsyncStorage.setItem("student_id", studentId);
                router.replace("/");
            } else {
                const data = await response.json();
                console.log("Login failed:", data);
                showAlert(
                    "Login Failed",
                    data.detail || "Invalid credentials",
                );
            }
        } catch (error) {
            showAlert("Error", "Could not connect to server");
        } finally {
            setLoading(false);
        }
    };

    const styles = createLoginStyles(colors, dark);

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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>
                    
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
                                placeholderTextColor={colors.text + '80'}
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder="Enter your password"
                                placeholderTextColor={colors.text + '80'}
                            />
                        </View>
                        
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.push("/(auth)/activate")}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>Activate Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

