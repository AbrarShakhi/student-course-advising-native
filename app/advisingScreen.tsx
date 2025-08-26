import { createAdvisingScreenStyles } from "@/styles/global";
import { API_URL } from "@/utils/api";
import showAlert from "@/utils/showAlert"; // Import the showAlert function
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [universityData, setUniversityData] = useState<UniversityData | null>(
    null
  );
  const [eligibleCourses, setEligibleCourses] = useState<Course[]>([]);
  const [chosenCourses, setChosenCourses] = useState<ChosenCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisingData = useCallback(async () => {
    try {
      setLoading(true);

      const uniResponse = await fetch(`${API_URL}/university-info`);
      if (!uniResponse.ok) {
        throw new Error("Failed to fetch university information.");
      }
      const uniData: UniversityData = await uniResponse.json();
      setUniversityData(uniData);

      if (uniData.is_advising) {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const coursesResponse = await fetch(`${API_URL}/list-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!coursesResponse.ok)
          throw new Error("Failed to fetch eligible courses.");
        const coursesData = await coursesResponse.json();
        setEligibleCourses(coursesData.courses || []);

        const chosenResponse = await fetch(
          `${API_URL}/list-chosen-courses?season_id=${uniData.curr_season_id}&year=${uniData.curr_year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!chosenResponse.ok)
          throw new Error("Failed to fetch chosen courses.");
        const chosenData = await chosenResponse.json();
        setChosenCourses(chosenData.chosen_courses || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvisingData();
  }, [fetchAdvisingData]);

  const handleAction = async (
    course_id: string,
    action: "select" | "deselect"
  ) => {
    setIsActionLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showAlert("Error", "Authentication token not found.", "error");
        return;
      }
      const response = await fetch(
        `${API_URL}/${action}-course?course_id=${course_id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} course.`);
      }
      const result = await response.json();
      showAlert("Success", result.message, "success");
      fetchAdvisingData(); // Refresh data after successful action
    } catch (err: any) {
      console.error("API error:", err);
      showAlert("Error", err.message, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

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

  const totalCredits = useMemo(() => {
    return chosenCourses.reduce((sum, chosen) => {
      const course = eligibleCourses.find(
        (c) => c.course_id === chosen.course_id
      );
      return sum + (course?.course_credit || 0);
    }, 0);
  }, [chosenCourses, eligibleCourses]);

  const renderCourseCard = (course: Course, isChosen: boolean) => {
    return (
      <TouchableOpacity
        key={course.course_id}
        style={[
          styles.courseCard,
          {
            borderLeftColor: isChosen ? "#4ade80" : colors.primary,
          },
        ]}
        onPress={() =>
          handleAction(course.course_id, isChosen ? "deselect" : "select")
        }
        disabled={isActionLoading}
      >
        <View style={styles.courseInfo}>
          <Text style={styles.courseId}>{course.course_id}</Text>
          <Text style={styles.courseTitle}>{course.course_title}</Text>
          <Text style={styles.courseCredit}>
            Credits: {course.course_credit}
          </Text>
        </View>
        <View style={styles.actionIcon}>
          {isActionLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons
              name={isChosen ? "checkmark-circle" : "add-circle"}
              size={32}
              color={isChosen ? "#4ade80" : colors.primary}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          {error || "An unexpected error occurred."}
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
            <Text style={styles.detailLabel}>Credits Needed</Text>
            <Text
              style={styles.detailValue}
            >{`${min_cred_need} - ${max_cred_need}`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Selected Credits</Text>
            <Text style={styles.detailValue}>{totalCredits}</Text>
          </View>
        </View>
        {is_advising ? (
          <>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={colors.text} />
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
