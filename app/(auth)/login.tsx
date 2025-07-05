import { API_URL } from "@/utils/api";

import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const LOGIN_URL = `${API_URL}/login`;

export default function LoginScreen() {
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                router.replace("/(main)/home");
            } else {
                const data = await response.json();
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

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Student ID</Text>
            <TextInput
                style={styles.input}
                value={studentId}
                onChangeText={setStudentId}
                autoCapitalize="none"
                keyboardType="number-pad"
                placeholder="Enter your student ID"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
            />
            <Button
                title={loading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    label: { fontSize: 16, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginBottom: 16,
        fontSize: 16,
    },
});
