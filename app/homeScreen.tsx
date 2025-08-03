import { createHomeStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

const SEMESTERS_URL = `${API_URL}/class-schedule`;

type ScheduleItem = {
  course_id: string;
  section_no: number;
  room_no: string;
  day: string;
  start_time: string;
  end_time: string;
  faculty_short_id: string;
};

type GroupedSchedule = {
  [key: string]: ScheduleItem[];
};

const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("access_token");
};

export default function homeScreen({ route }: any) {
  // const { year, season_id } = route.params; // Uncomment when using real navigation
  const { year, season_id } = { year: 2025, season_id: 1 }; // Mock data for standalone viewing

  const { colors, dark } = useTheme();
  const styles = createHomeStyles(colors, dark);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken();
        if (!token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        const url = `${API_URL}/class-schedule?year=${year}&season_id=${season_id}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch schedule.");
        }

        const data = await response.json();
        setSchedule(data.schedule || []);
      } catch (e: any) {
        setError(e.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [year, season_id]);

  // Group the schedule by day using useMemo for performance
  const groupedSchedule = useMemo<GroupedSchedule>(() => {
    if (!schedule) return {};
    return schedule.reduce((acc, item) => {
      const day = item.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {} as GroupedSchedule);
  }, [schedule]);

  const orderedDays = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const scheduleDays = orderedDays.filter((day) => groupedSchedule[day]);

  // --- Render Logic ---
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Your Schedule...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.notification}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (schedule.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="calendar-outline" size={48} color={colors.text} />
        <Text style={styles.emptyText}>
          No classes found for this semester.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>Class Routine</Text>
        <Text style={styles.headerSubtitle}>
          Showing schedule for{" "}
          {season_id === 1 ? "Spring" : season_id === 2 ? "Summer" : "Fall"}{" "}
          {year}
        </Text>

        {scheduleDays.map((day) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayHeader}>{day}</Text>
            {groupedSchedule[day].map((item, index) => (
              <View key={index} style={styles.classCard}>
                <View style={styles.classCardHeader}>
                  <Text style={styles.courseId}>{item.course_id}</Text>
                  <Text style={styles.facultyId}>{item.faculty_short_id}</Text>
                </View>
                <View style={styles.classCardBody}>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={colors.text}
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>
                      {item.start_time} - {item.end_time}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={colors.text}
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>Room: {item.room_no}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="list-outline"
                      size={16}
                      color={colors.text}
                      style={styles.icon}
                    />
                    <Text style={styles.infoText}>
                      Section: {item.section_no}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
