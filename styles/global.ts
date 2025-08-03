import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// Define a more modern and consistent color palette
const AppColors = {
  dark: {
    background: "#121212", // Very dark background
    cardBackground: "#1E1E1E", // Slightly lighter for cards/elements
    primary: "#80d0dfff", // Purple/Violet for primary actions/highlights
    accent: "#03DAC6", // Teal for secondary highlights
    text: "#E0E0E0", // Light gray for general text
    placeholder: "#888888", // Gray for placeholders
    border: "#333333", // Darker gray for subtle borders
    buttonDisabled: "#444444", // Darker disabled button
    buttonTextDisabled: "#AAAAAA", // Lighter text for disabled button
  },
  light: {
    background: "#F5F5F5", // Light background
    cardBackground: "#FFFFFF", // White for cards/elements
    primary: "#6200EE", // Deep purple
    accent: "#03DAC6", // Teal
    text: "#212121", // Dark gray for general text
    placeholder: "#B0B0B0", // Light gray for placeholders
    border: "#E0E0E0", // Light border
    buttonDisabled: "#CCCCCC", // Lighter disabled button
    buttonTextDisabled: "#888888", // Darker text for disabled button
  },
};

export const createAccountScreenStyles = (colors: any, dark: boolean) => {
  const baseStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "android" ? 40 : 50,
    },
    profileSection: {
      alignItems: "flex-start",
      paddingHorizontal: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 110,
      height: 110,
      marginTop: -10,
      borderRadius: 60,
      marginBottom: 16,
    },
    name: {
      fontSize: 23,
      fontWeight: "bold",
      color: colors.text,
    },
    studentId: {
      fontSize: 16,
      color: colors.text + "AA",
      marginTop: 4,
    },
    actionsSection: {
      marginTop: "70%",
      paddingHorizontal: 24,
    },
    actionButton: {
      backgroundColor: dark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
      borderRadius: 12,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    actionButtonText: {
      fontSize: 16,
      color: colors.text,
    },
    logoutButton: {
      backgroundColor: dark
        ? "rgba(255, 82, 82, 0.1)"
        : "rgba(255, 82, 82, 0.1)",
    },
    logoutButtonText: {
      color: "#FF5252",
      fontWeight: "bold",
    },
  });

  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      container: {
        ...baseStyles.container,
        justifyContent: "center",
        alignItems: "center",
      },
      profileSection: {
        ...baseStyles.profileSection,
        maxWidth: 480,
        width: "100%",
        alignSelf: "center",
        borderBottomWidth: 0,
        paddingBottom: 0,
      },
      actionsSection: {
        ...baseStyles.actionsSection,
        maxWidth: 480,
        width: "100%",
        alignSelf: "center",
      },
    });
  }

  return baseStyles;
};

export const createAppLayoutStyles = (
  colors: typeof AppColors.light,
  dark: boolean
) => {
  const currentColors = dark ? AppColors.dark : AppColors.light;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 16,
      color: currentColors.text,
    },
    subtitle: {
      fontSize: 18,
      color: currentColors.text + "AA",
      textAlign: "center",
    },
    // Styles for the tab bar itself
    tabBarStyle: {
      borderTopWidth: 0, // Remove default top border
      elevation: 15,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      height: Platform.OS === "ios" ? 90 : 60, // Adjust height for iOS notch
      paddingBottom: Platform.OS === "ios" ? 30 : 0, // Padding for iOS safe area
    },
    // Styles for individual tab bar items
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "600",
      marginTop: 2,
    },
    // Styles for the tab bar indicator (e.g., when a tab is active)
    tabBarIndicatorStyle: {
      backgroundColor: currentColors.primary, // Primary color for the active indicator
      height: 3,
      borderRadius: 2,
      width: "60%", // Make indicator shorter than the tab
      alignSelf: "center",
      position: "absolute",
      bottom: 0,
    },
    tabBarIcon: {
      color: currentColors.text + "80", // Slightly transparent for inactive icons
    },
  });
};

export const createActivateStyles = (colors: any, dark: boolean) => {
  //For mobile
  const baseStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "space-between",
      paddingTop: Platform.OS === "android" ? 30 : 40,
      paddingBottom: 24,
    },
    backButton: { paddingTop: 25, marginBottom: 15 },
    header: {
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.text + "AA",
    },
    formContainer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    input: {
      backgroundColor: dark
        ? "rgba(0, 179, 255, 0.19)"
        : "rgba(218, 113, 113, 0.05)",
      borderRadius: 12,
      padding: 20,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
      borderWidth: 0,
    },

    button: {
      borderRadius: 12,
      padding: 20,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
      fontSize: 16,
    },
    buttonDisabled: {
      backgroundColor: dark ? "#6B7280" : "#9CA3AF",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  //For web
  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      container: {
        ...baseStyles.container,
        paddingTop: 40,
        justifyContent: "center",
      },

      formContainer: {
        ...baseStyles.formContainer,
        maxWidth: 480,
        width: "100%",
        alignSelf: "center",
        borderRadius: 16,
        padding: 40,
      },

      title: {
        ...baseStyles.title,
        textAlign: "center",
      },

      subtitle: {
        ...baseStyles.subtitle,
        textAlign: "center",
      },
    });
  }

  return baseStyles;
};

export const createLoginStyles = (colors: any, dark: boolean) => {
  // For mobile
  const baseStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "space-between",
      paddingTop: Platform.OS === "android" ? 80 : 40,
      paddingBottom: 24,
    },
    header: {
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.text + "AA",
    },
    formContainer: {
      paddingHorizontal: 24,
      paddingBottom: 2,
    },
    input: {
      backgroundColor: dark
        ? "rgba(0, 179, 255, 0.19)"
        : "rgba(218, 113, 113, 0.05)",
      borderRadius: 12,
      padding: 20,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
      borderWidth: 0,
    },
    button: {
      borderRadius: 12,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    secondaryButton: {
      marginTop: 20,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "500",
    },
    forgotPasswordButton: {
      alignSelf: "flex-start",
      paddingVertical: 8,
      marginBottom: 8,
    },
    forgotPasswordText: {
      color: colors.text + "AA",
      fontSize: 14,
      fontWeight: "500",
    },
  });

  // For Web
  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,

      container: {
        ...baseStyles.container,
        paddingTop: 40,
        justifyContent: "center",
      },

      formContainer: {
        ...baseStyles.formContainer,
        maxWidth: 480,
        width: "100%",
        alignSelf: "center",
        borderRadius: 16,
        padding: 40,
      },
      title: {
        ...baseStyles.title,
        textAlign: "center",
      },
      subtitle: {
        ...baseStyles.subtitle,
        textAlign: "center",
      },
    });
  }

  return baseStyles;
};

export const createForgotStyles = (colors: any, dark: boolean) => {
  //For mobile
  const baseStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "space-between",
      paddingTop: Platform.OS === "android" ? 30 : 40,
      paddingBottom: 24,
    },
    backButton: { paddingTop: 25, marginBottom: 15 },
    header: {
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.text + "AA",
    },
    formContainer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    input: {
      backgroundColor: dark
        ? "rgba(0, 179, 255, 0.19)"
        : "rgba(218, 113, 113, 0.05)",
      borderRadius: 12,
      padding: 20,
      fontSize: 16,
      color: colors.text,
      marginBottom: 15,
      borderWidth: 0,
    },

    button: {
      borderRadius: 12,
      padding: 20,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
      fontSize: 16,
    },
    buttonDisabled: {
      backgroundColor: dark ? "#6B7280" : "#9CA3AF",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  //For web
  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      container: {
        ...baseStyles.container,
        paddingTop: 40,
        justifyContent: "center",
      },

      formContainer: {
        ...baseStyles.formContainer,
        maxWidth: 480,
        width: "100%",
        alignSelf: "center",
        borderRadius: 16,
        padding: 40,
      },

      title: {
        ...baseStyles.title,
        textAlign: "center",
      },

      subtitle: {
        ...baseStyles.subtitle,
        textAlign: "center",
      },
    });
  }

  return baseStyles;
};

export const createHomeStyles = (colors: any, dark: boolean) => {
  const baseStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    // Centered container for loading, error, and empty states
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 24,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 20,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.text + "AA",
      marginBottom: 24,
    },
    dayContainer: {
      marginBottom: 24,
    },
    dayHeader: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.primary,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 8,
    },
    classCard: {
      backgroundColor: dark ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: dark ? 0.2 : 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    classCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    courseId: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    facultyId: {
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      overflow: "hidden", // Ensures background respects border radius
    },
    classCardBody: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    icon: {
      marginRight: 8,
      opacity: 0.8,
    },
    infoText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.9,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.text,
    },
    errorText: {
      marginTop: 16,
      color: colors.notification || "#FF5252", // Fallback color
      textAlign: "center",
      fontSize: 16,
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
  });

  // --- Web-Specific Overrides ---
  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      // On web, the safeArea centers the content card
      safeArea: {
        flex: 1,
        backgroundColor: dark ? "#000" : "#EFEFEF",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      // This is the "mobile screen" container for the web
      container: {
        backgroundColor: colors.background,
        flex: 1,
        width: "100%",
        maxWidth: 450,
        height: "100%",
        maxHeight: 812,
        borderRadius: 24,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
      },
      // The centered container needs to be contained within the web view
      centered: {
        ...baseStyles.centered,
        maxWidth: 450,
        height: "100%",
        maxHeight: 812,
        borderRadius: 24,
      },
      // Adjust padding for the header inside the web card
      headerTitle: {
        ...baseStyles.headerTitle,
        paddingHorizontal: 16,
      },
      headerSubtitle: {
        ...baseStyles.headerSubtitle,
        paddingHorizontal: 16,
      },
    });
  }

  // Return base styles for mobile
  return baseStyles;
};
