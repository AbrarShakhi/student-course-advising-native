import { API_URL } from "@/utils/api";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

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
                Alert.alert(
                    "Login Failed",
                    data.detail || "Invalid credentials",
                );
            }
        } catch (error) {
            Alert.alert("Error", "Could not connect to server");
        } finally {
            setLoading(false);
        }
    };

    const styles = createStyles(colors, dark);

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
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const { width, height } = Dimensions.get('window');

const createStyles = (colors: any, dark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
        minHeight: height,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: dark ? '#374151' : '#E5E7EB',
        ...Platform.select({
            android: {
                elevation: dark ? 8 : 4,
            },
            web: {
                boxShadow: dark 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
        }),
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 8,
        ...Platform.select({
            web: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
        }),
    },
    subtitle: {
        fontSize: 16,
        color: colors.text + 'CC',
        textAlign: 'center',
        marginBottom: 32,
        ...Platform.select({
            web: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
        }),
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
        ...Platform.select({
            web: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
        }),
    },
    input: {
        borderWidth: 1,
        borderColor: dark ? '#4B5563' : '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: colors.card,
        color: colors.text,
        ...Platform.select({
            android: {
                elevation: dark ? 2 : 1,
            },
            web: {
                transition: 'all 0.2s ease-in-out',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                boxShadow: dark 
                    ? '0 1px 2px rgba(0, 0, 0, 0.2)'
                    : '0 1px 2px rgba(0, 0, 0, 0.05)',
            },
        }),
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        ...Platform.select({
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: `0 4px 6px -1px ${colors.primary}50, 0 2px 4px -1px ${colors.primary}30`,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
            },
        }),
    },
    buttonDisabled: {
        backgroundColor: dark ? '#6B7280' : '#9CA3AF',
        ...Platform.select({
            android: {
                elevation: 0,
            },
            web: {
                boxShadow: 'none',
                cursor: 'not-allowed',
            },
        }),
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        ...Platform.select({
            web: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
        }),
    },
});
