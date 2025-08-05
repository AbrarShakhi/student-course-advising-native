import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createHomeStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";

// --- Type Definitions ---
type ScheduleItem = {
  course_id: string;
  section_no: number;
  room_no: string;
  day: string;
  start_time: string;
  end_time: string;
  faculty_short_id: string;
};

type SemesterInfo = {
  year: number;
  season_id: number;
  season_name: string;
};

type GroupedSchedule = {
  [key: string]: ScheduleItem[];
};

export default function HomeScreen() {
  const { colors, dark } = useTheme();
  const styles = createHomeStyles(colors, dark);
  const pickerStyles = StyleSheet.create({
    pickerItem: { color: colors.text },
  });

  // Get parameters passed from the Login screen
  const params = useLocalSearchParams();
  const initialAccessToken = params.accessToken as string;
  const initialStudentId = params.studentId as string;

  // --- State Management ---
  const [initialLoading, setInitialLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // This effect runs once when the screen is focused to load initial data
  useFocusEffect(
    useCallback(() => {
      const fetchInitialData = async () => {
        setInitialLoading(true);
        setError(null);
        try {
          // Fetch the semester list
          const semestersResponse = await fetch(`${API_URL}/list-semesters`);
          if (!semestersResponse.ok) {
            throw new Error("Could not load semester list.");
          }
          const semestersData: { semesters: SemesterInfo[] } =
            await semestersResponse.json();

          // Fetch the university info
          const uniInfoResponse = await fetch(`${API_URL}/university-info`);
          if (!uniInfoResponse.ok) {
            throw new Error("Could not load university info.");
          }
          const uniInfo = await uniInfoResponse.json();

          const years = [
            ...new Set(semestersData.semesters.map((s) => s.year)),
          ].sort((a, b) => b - a);
          const seasonMap = new Map<number, { id: number; name: string }>();
          semestersData.semesters.forEach((s) =>
            seasonMap.set(s.season_id, { id: s.season_id, name: s.season_name })
          );

          setAvailableYears(years);
          setAvailableSeasons(Array.from(seasonMap.values()));

          setSelectedYear(uniInfo.curr_year);
          setSelectedSeason(uniInfo.curr_season);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchInitialData();
    }, [])
  );

  // This effect runs whenever the user changes the selected year or season,
  // or when the component is first mounted/re-focused.
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedYear || !selectedSeason) {
        return;
      }

      setScheduleLoading(true);
      setError(null);
      setSchedule([]);

      let token = initialAccessToken;
      if (!token) {
        // If no token was passed via params, try to get it from storage
        token = (await AsyncStorage.getItem("access_token")) ?? "";
      }

      // if (!token) {
      //   // If token is still not found, log out the user
      //   await AsyncStorage.clear();
      //   router.replace("/(auth)/login");
      //   return;
      // }

      // If we got a token from params, save it to storage for future use
      if (initialAccessToken) {
        await AsyncStorage.setItem("access_token", initialAccessToken);
      }

      try {
        const url = `${API_URL}/class-schedule?year=${selectedYear}&season_id=${selectedSeason}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          // if (response.status === 401) {
          //   // Unauthorized error, log the user out
          //   await AsyncStorage.clear();
          //   router.replace("/(auth)/login");
          // }
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch schedule.");
        }

        const data = await response.json();
        setSchedule(data.schedule || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedYear, selectedSeason, initialAccessToken]);

  // Memoized data grouping for performance
  const groupedSchedule = useMemo<GroupedSchedule>(() => {
    return schedule.reduce((acc, item) => {
      const day = item.day;
      if (!acc[day]) acc[day] = [];
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

  // --- Render Functions ---
  const renderScheduleContent = () => {
    if (scheduleLoading) {
      return (
        <View style={styles.centeredMessage}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Schedule...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centeredMessage}>
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
        <View style={styles.centeredMessage}>
          <Ionicons name="calendar-outline" size={48} color={colors.text} />
          <Text style={styles.emptyText}>
            No classes found for this semester.
          </Text>
        </View>
      );
    }
    return scheduleDays.map((day) => (
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
                <Text style={styles.infoText}>Section: {item.section_no}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    ));
  };

  const renderContent = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Class Routine</Text>
      </View>
      {initialLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <View style={styles.pickerRow}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
              itemStyle={pickerStyles.pickerItem}
            >
              {availableYears.map((year) => (
                <Picker.Item key={year} label={String(year)} value={year} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSeason}
              onValueChange={(itemValue) => setSelectedSeason(itemValue)}
              style={styles.picker}
              itemStyle={pickerStyles.pickerItem}
            >
              {availableSeasons.map((season) => (
                <Picker.Item
                  key={season.id}
                  label={season.name}
                  value={season.id}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
      {renderScheduleContent()}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {Platform.OS === "web" ? (
        <View style={styles.webContentWrapper}>{renderContent()}</View>
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
}
