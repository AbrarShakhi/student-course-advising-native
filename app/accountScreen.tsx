import { createAccountScreenStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const USER_URL = `${API_URL}/student`;

export default function AccountScreen() {
  const { colors, dark } = useTheme();
  const styles = createAccountScreenStyles(colors, dark);
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const studentId = await AsyncStorage.getItem("student_id");
  //       if (studentId) {
  //         const data = await get(`${USER_URL}/${studentId}`);
  //         setUserData(data);
  //       }
  //     } catch (error: any) {
  //       showAlert("Failed to fetch user data.", "error");
  //       console.error("Fetch user data error: ", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("student_id");
    router.replace("/(auth)/login");
  };

  const handleChangePassword = () => {
    // Handle change password logic
  };

  // if (!userData) {
  //   return null;
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Alice Help</Text>
        <Text style={styles.studentId}>2022-3-60-022</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleChangePassword}
        >
          <Text style={styles.actionButtonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
