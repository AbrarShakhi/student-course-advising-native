import { createAdvisingScreenStyles } from "@/styles/global"; // Assuming you will add this file
import { API_URL } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

const UNIVERSITY_INFO_URL = `${API_URL}/university-info`;

interface UniversityData {
  option: number;
  is_advising: boolean;
  curr_season: string;
  curr_year: number;
  credit_id: number;
  min_cred_need: number;
  max_cred_need: number;
}

export default function AdvisingScreen() {
  const { colors, dark } = useTheme();
  const styles = createAdvisingScreenStyles(colors, dark);
  const [universityData, setUniversityData] = useState<UniversityData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await fetch(UNIVERSITY_INFO_URL);

        if (response.ok) {
          const data: UniversityData = await response.json();
          setUniversityData(data);
        } else {
          Alert.alert("Error", "Failed to fetch university information.");
        }
      } catch (error) {
        console.error("Error fetching university data:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, []);

  const getAdvisingStatusText = (isAdvising: boolean) => {
    return isAdvising ? "Advising is Active" : "Advising is Not Active";
  };

  const getAdvisingStatusColor = (isAdvising: boolean) => {
    return isAdvising ? "green" : "red";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!universityData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load university data.</Text>
      </View>
    );
  }

  const { is_advising, curr_season, curr_year, min_cred_need, max_cred_need } =
    universityData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>University Advising Information</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Ionicons
              name={is_advising ? "checkmark-circle" : "close-circle"}
              size={24}
              color={getAdvisingStatusColor(is_advising)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getAdvisingStatusColor(is_advising) },
              ]}
            >
              {getAdvisingStatusText(is_advising)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Current Semester and Year</Text>
            <Text
              style={styles.detailValue}
            >{`${curr_season} / ${curr_year}`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Min. Credits Needed</Text>
            <Text style={styles.detailValue}>{min_cred_need}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Max. Credits Needed</Text>
            <Text style={styles.detailValue}>{max_cred_need}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
