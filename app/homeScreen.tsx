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

const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("access_token");
};

export default function HomeScreen() {
  const { colors, dark } = useTheme();
  const styles = createHomeStyles(colors, dark);
  // Separate style object for picker text color to avoid type conflicts
  const pickerStyles = StyleSheet.create({
    pickerItem: { color: colors.text },
  });

  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
          const semestersResponse = await fetch(`${API_URL}/list-semesters`);
          if (!semestersResponse.ok)
            throw new Error("Could not load semester list.");
          const semestersData: { semesters: SemesterInfo[] } =
            await semestersResponse.json();

          // --- FIX: Add explicit types to fix inference errors ---
          const years = [
            ...new Set(
              semestersData.semesters.map((s: SemesterInfo) => s.year)
            ),
          ];
          years.sort((a: number, b: number) => b - a);

          const seasonMap = new Map<number, { id: number; name: string }>();
          semestersData.semesters.forEach((s: SemesterInfo) =>
            seasonMap.set(s.season_id, { id: s.season_id, name: s.season_name })
          );

          setAvailableYears(years);
          setAvailableSeasons(Array.from(seasonMap.values()));

          const uniInfoResponse = await fetch(`${API_URL}/university-info`);
          if (!uniInfoResponse.ok)
            throw new Error("Could not load university info.");
          const uniInfo = await uniInfoResponse.json();

          setSelectedYear(uniInfo.curr_year);
          setSelectedSeason(uniInfo.curr_season);
        } catch (e: any) {
          setError(e.message);
          setLoading(false);
        }
      };
      fetchInitialData();
    }, [])
  );

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedYear || !selectedSeason) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken();
        if (!token) throw new Error("Authentication token not found.");

        const url = `${API_URL}/class-schedule?year=${selectedYear}&season_id=${selectedSeason}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch schedule.");
        }

        const data = await response.json();
        setSchedule(data.schedule || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedYear, selectedSeason]);

  const groupedSchedule = useMemo<GroupedSchedule>(() => {
    if (!schedule) return {};
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

  const renderContent = () => (
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

      {loading ? (
        <View style={styles.centeredMessage}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Schedule...</Text>
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
      {Platform.OS === "web" ? (
        <View style={styles.webContentWrapper}>{renderContent()}</View>
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
}
