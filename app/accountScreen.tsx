import { createAccountScreenStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
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
  mobile_no: string;
  address: string;
  gardian_name: string;
  gardian_phone: string;
  is_dismissed: boolean;
  is_graduated: boolean;
  credit_completed: number;
  dept_id: number;
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
          await AsyncStorage.removeItem("access_token");
          router.replace("/(auth)/login");
        } else {
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

  const {
    student_id,
    first_name,
    last_name,
    email,
    mobile_no,
    address,
    gardian_name,
    gardian_phone,
    is_dismissed,
    is_graduated,
    credit_completed,
    dept_id,
  } = userData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Text style={styles.name}>{`${first_name} ${last_name}`}</Text>
          <Text style={styles.studentId}>{student_id}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons
              name="mail"
              size={20}
              color={colors.text + "80"}
              style={styles.icon}
            />
            <View>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{email}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="call"
              size={20}
              color={colors.text + "80"}
              style={styles.icon}
            />
            <View>
              <Text style={styles.detailLabel}>Mobile No.</Text>
              <Text style={styles.detailValue}>{mobile_no}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="location"
              size={20}
              color={colors.text + "80"}
              style={styles.icon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{address}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="person-circle"
              size={20}
              color={colors.text + "80"}
              style={styles.icon}
            />
            <View>
              <Text style={styles.detailLabel}>Guardian Name</Text>
              <Text style={styles.detailValue}>{gardian_name}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="call"
              size={20}
              color={colors.text + "80"}
              style={styles.icon}
            />
            <View>
              <Text style={styles.detailLabel}>Guardian Phone</Text>
              <Text style={styles.detailValue}>{gardian_phone}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="school"
              size={20}
              color={colors.text + "80"}
              style={styles.icon}
            />
            <View>
              <Text style={styles.detailLabel}>Credits Completed</Text>
              <Text style={styles.detailValue}>{credit_completed}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="ribbon"
              size={20}
              color={colors.text + "80"}
              style={styles.icon}
            />
            <View>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>
                {is_graduated
                  ? "Graduated"
                  : is_dismissed
                    ? "Dismissed"
                    : "Active"}
              </Text>
            </View>
          </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}
