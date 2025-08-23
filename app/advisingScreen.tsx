import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { createAdvisingScreenStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import { get } from "@/utils/fetch";

// --- Helper to get auth token ---
// This function remains the same as it correctly retrieves the token.
const getAuthToken = async () => {
  return await AsyncStorage.getItem("access_token");
};

// --- Type Definitions ---
interface UniversityData {
  is_advising: boolean;
  curr_season: string;
  curr_season_id: number;
  curr_year: number;
  min_cred_need: number;
  max_cred_need: number;
}

interface Course {
  course_id: string;
  course_title: string;
  course_credit: number;
}
interface ChosenCourse {
  course_id: string;
}

export default function AdvisingScreen() {
  const { colors, dark } = useTheme();
  const styles = createAdvisingScreenStyles(colors, dark);

  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [universityData, setUniversityData] = useState<UniversityData | null>(
    null
  );
  const [eligibleCourses, setEligibleCourses] = useState<Course[]>([]);
  const [chosenCourses, setChosenCourses] = useState<ChosenCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch university data
        const uniResponse = await fetch(`${API_URL}/university-info`);
        if (!uniResponse.ok) {
          throw new Error("Failed to fetch university information.");
        }
        const uniData: UniversityData = await uniResponse.json();
        setUniversityData(uniData);

        if (uniData.is_advising) {
          const token = await getAuthToken();
          if (!token) {
            throw new Error("Authentication token not found. Please log in.");
          }

          // Fetch eligible courses
          const coursesResponse = await get<{ courses: Course[] }>(
            `${API_URL}/list-courses`,
            token
          );
          setEligibleCourses(coursesResponse.courses || []);

          // Fetch chosen courses
          const chosenCoursesResponse = await get<{
            chosen_courses: ChosenCourse[];
          }>(
            `${API_URL}/list-chosen-courses?season_id=${uniData.curr_season_id}&year=${uniData.curr_year}`,
            token
          );
          setChosenCourses(chosenCoursesResponse.chosen_courses || []);
        }
      } catch (err: any) {
        // Corrected error handling to catch all potential errors
        console.error("Fetch error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // --- Filtering Logic ---
  const filteredCourses = useMemo(() => {
    if (!searchTerm) {
      return eligibleCourses;
    }
    return eligibleCourses.filter(
      (course) =>
        course.course_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [eligibleCourses, searchTerm]);

  // --- Render Helper Components ---
  const renderCourseCard = (course: Course, isChosen: boolean) => (
    <View
      key={course.course_id}
      style={[
        styles.courseCard,
        { borderLeftColor: isChosen ? "#4ade80" : colors.primary },
      ]}
    >
      <View style={styles.courseCardHeader}>
        <Text style={styles.courseId}>{course.course_id}</Text>
        <Text style={styles.courseCredit}>{course.course_credit} Credits</Text>
      </View>
      <Text style={styles.courseTitle}>{course.course_title}</Text>
    </View>
  );

  // --- Main Render Logic ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>
          Loading data...
        </Text>
      </View>
    );
  }

  if (error || !universityData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red", textAlign: "center" }}>
          {error ||
            "Failed to load data. Please check your network connection."}
        </Text>
      </View>
    );
  }

  const { is_advising, curr_season, curr_year, min_cred_need, max_cred_need } =
    universityData;

  const chosenCourseDetails = chosenCourses
    .map((chosen) =>
      eligibleCourses.find((c) => c.course_id === chosen.course_id)
    )
    .filter(Boolean) as Course[];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Advising Portal</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Ionicons
              name={is_advising ? "checkmark-circle" : "close-circle"}
              size={24}
              color={is_advising ? "#4ade80" : "#f87171"}
            />
            <Text
              style={[
                styles.statusText,
                { color: is_advising ? "#4ade80" : "#f87171" },
              ]}
            >
              {is_advising ? "Advising is Active" : "Advising is Closed"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Current Semester</Text>
            <Text
              style={styles.detailValue}
            >{`${curr_season} ${curr_year}`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Required Credits</Text>
            <Text
              style={styles.detailValue}
            >{`${min_cred_need} - ${max_cred_need}`}</Text>
          </View>
        </View>

        {is_advising ? (
          <>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.text + "80"} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search eligible courses..."
                placeholderTextColor={colors.text + "80"}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>

            {chosenCourseDetails.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Your Chosen Courses</Text>
                {chosenCourseDetails.map((course) =>
                  renderCourseCard(course, true)
                )}
              </>
            )}

            <Text style={styles.sectionHeader}>Eligible Courses</Text>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => renderCourseCard(course, false))
            ) : (
              <Text
                style={{
                  color: colors.text,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                No eligible courses match your search.
              </Text>
            )}
          </>
        ) : (
          <View style={styles.advisingClosedContainer}>
            <Ionicons
              name="information-circle-outline"
              size={48}
              color={colors.primary}
            />
            <Text style={styles.advisingClosedText}>
              The advising period is currently closed. Please check back later.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
