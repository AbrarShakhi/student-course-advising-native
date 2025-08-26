import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useTheme } from "@react-navigation/native";
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
import { get } from "@/utils/fetch";

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

type SemestersResponse = {
  semesters: SemesterInfo[];
};

type GroupedSchedule = {
  [key: string]: ScheduleItem[];
};

const getStudentId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("student_id");
};

const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("access_token");
};

export default function HomeScreen() {
  const { colors, dark } = useTheme();
  const styles = createHomeStyles(colors, dark);
  const pickerStyles = StyleSheet.create({
    pickerItem: { color: colors.text },
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedSeason, setSelectedSeason] = useState<number>();

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchAllData = async () => {
        setIsInitialLoading(true);
        setError(null);
        try {
          // Attempting to fetch student ID and access token from AsyncStorage...
          const id = await getStudentId();
          const token = await getAccessToken();

          if (!isMounted) return;

          // Check for token and student ID. Both are required for the schedule.
          if (!token || !id) {
            throw new Error(
              "Authentication token or Student ID not found. Please log in again."
            );
          }

          setStudentId(id);
          setAccessToken(token);

          // 1. Fetch available semesters (this endpoint does not require auth based on your backend code)
          const semestersData = await get<SemestersResponse>(
            `${API_URL}/list-semesters`,
            token
          );

          if (!isMounted) return;

          if (
            !semestersData.semesters ||
            semestersData.semesters.length === 0
          ) {
            throw new Error("No semester data could be found.");
          }

          const years = [
            ...new Set(
              semestersData.semesters.map((s: SemesterInfo) => s.year)
            ),
          ].sort((a, b) => b - a);
          const seasonMap = new Map<number, { id: number; name: string }>();
          semestersData.semesters.forEach((s: SemesterInfo) =>
            seasonMap.set(s.season_id, { id: s.season_id, name: s.season_name })
          );

          const latestSemester = [...semestersData.semesters].sort(
            (a: SemesterInfo, b: SemesterInfo) =>
              b.year - a.year || b.season_id - a.season_id
          )[0];

          setAvailableYears(years);
          setAvailableSeasons(Array.from(seasonMap.values()));
          setSelectedYear(latestSemester.year);
          setSelectedSeason(latestSemester.season_id);

          // 2. Fetch the class schedule using the access token
          setScheduleLoading(true);
          const scheduleUrl = `${API_URL}/class-schedule?student_id=${id}&year=${latestSemester.year}&season_id=${latestSemester.season_id}`;
          const scheduleData = await get<{ schedule: ScheduleItem[] }>(
            scheduleUrl,
            token
          );

          if (!isMounted) return;

          setSchedule(scheduleData.schedule || []);
        } catch (e: any) {
          if (isMounted) {
            console.error("Error during data fetching:", e); // Added log for more detail
            setError(e.message);
            setSchedule([]);
          }
        } finally {
          if (isMounted) {
            setIsInitialLoading(false);
            setScheduleLoading(false);
          }
        }
      };

      fetchAllData();

      return () => {
        isMounted = false;
      };
    }, []) // Empty dependency array means this runs once when the screen is focused
  );

  // This useEffect will run when the user selects a new year or season
  useEffect(() => {
    // Only run if we have a token and the user has selected a semester
    if (!accessToken || !selectedYear || !selectedSeason) return;

    const fetchSchedule = async () => {
      setScheduleLoading(true);
      setError(null);
      setSchedule([]);

      try {
        const url = `${API_URL}/class-schedule?student_id=${studentId}&year=${selectedYear}&season_id=${selectedSeason}`;
        const data = await get<{ schedule: ScheduleItem[] }>(url, accessToken);
        setSchedule(data.schedule || []);
      } catch (e: any) {
        console.error("Error fetching schedule on selection:", e); // Added log
        setError(e.message);
        setSchedule([]);
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedYear, selectedSeason, accessToken, studentId]);

  // --- Data Memoization ---
  const groupedSchedule = useMemo<GroupedSchedule>(() => {
    const dayMap: { [key: string]: string } = {
      Sat: "Saturday",
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
    };
    return schedule.reduce((acc, item) => {
      const fullDay = dayMap[item.day] || "Unscheduled";
      if (!acc[fullDay]) acc[fullDay] = [];
      acc[fullDay].push(item);
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
  const renderScheduleContent = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Class Routine</Text>
      </View>
      <View style={styles.pickerRow}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
            itemStyle={pickerStyles.pickerItem}
            enabled={availableYears.length > 0}
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
            enabled={availableSeasons.length > 0}
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

      {scheduleLoading ? (
        <View style={styles.centeredMessage}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Schedule...</Text>
        </View>
      ) : schedule.length === 0 ? (
        <View style={styles.centeredMessage}>
          <Ionicons name="calendar-outline" size={48} color={colors.text} />
          <Text style={styles.emptyText}>
            No classes found for this semester.
          </Text>
        </View>
      ) : (
        scheduleDays.map((day) => (
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
        ))
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={
          Platform.OS === "web" ? styles.webContentWrapper : styles.container
        }
      >
        {isInitialLoading ? (
          <View style={styles.centeredMessage}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredMessage}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={colors.notification}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          renderScheduleContent()
        )}
      </View>
    </SafeAreaView>
  );
}
