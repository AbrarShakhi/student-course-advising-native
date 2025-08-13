import { createAccountScreenStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WELCOME_URL = `${API_URL}/welcome`;

interface StudentData {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function AccountScreen() {
  const { colors, dark } = useTheme();
  const styles = createAccountScreenStyles(colors, dark);
  const router = useRouter();
  const [userData, setUserData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        if (!accessToken) {
          router.replace("/(auth)/login");
          return;
        }

        const response = await fetch(WELCOME_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data: StudentData = await response.json();
          setUserData(data);
        } else if (response.status === 401) {
          // Token expired or invalid, force re-login
          await AsyncStorage.removeItem("access_token");
          router.replace("/(auth)/login");
        } else {
          // Handle other API errors
          Alert.alert("Error", "Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    router.replace("/(auth)/login");
  };

  const handleChangePassword = () => {
    router.push("/(auth)/changePassword");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If no user data is loaded, show a fallback or redirect
  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.name}>Failed to load user data.</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={handleLogout}>
          <Text style={{ color: colors.primary }}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { student_id, first_name, last_name } = userData;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{`${first_name} ${last_name}`}</Text>
        <Text style={styles.studentId}>{student_id}</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleChangePassword}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <LinearGradient
            colors={["#FF5252", "#E84457", "#D1365C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
