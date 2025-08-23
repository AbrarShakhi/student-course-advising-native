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
    },
    scrollContent: {
      paddingTop: Platform.OS === "android" ? 80 : 50,
      paddingBottom: 50,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    profileSection: {
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginTop: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 16,
      borderWidth: 3,
      borderColor: colors.border,
    },
    name: {
      fontSize: 25,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 8,
    },
    studentId: {
      fontSize: 18,
      color: colors.text + "AA",
      marginTop: 4,
    },
    detailsSection: {
      marginTop: 24,
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: dark
        ? "rgba(150, 149, 149, 0.2)"
        : "rgba(0, 0, 0, 0.05)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    icon: {
      marginRight: 16,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.text + "80",
    },
    detailValue: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    actionsSection: {
      paddingHorizontal: 24,
    },
    actionButton: {
      backgroundColor: dark
        ? "rgba(150, 149, 149, 0.2)"
        : "rgba(0, 0, 0, 0.05)",
      borderRadius: 12,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    logoutButton: {
      borderRadius: 12,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    logoutButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      container: {
        ...baseStyles.container,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
      },
      scrollContent: {
        ...baseStyles.scrollContent,
        maxWidth: 600,
        width: "100%",
        alignSelf: "center",
      },
      profileSection: {
        ...baseStyles.profileSection,
        maxWidth: 600,
        width: "100%",
        borderBottomWidth: 0,
        paddingBottom: 0,
      },
      detailsSection: {
        ...baseStyles.detailsSection,
        maxWidth: 600,
        width: "100%",
      },
      actionsSection: {
        ...baseStyles.actionsSection,
        maxWidth: 600,
        width: "100%",
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
      marginBottom: Platform.OS === "android" ? 32 : 0, // Margin for iOS safe area
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
  // --- Base Styles (for mobile: iOS/Android) ---
  const baseStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // This container holds the ScrollView
    container: {
      flex: 1,
    },
    // This view is inside the ScrollView and provides padding
    contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    // Centered container for loading, error, and empty states
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: 24,
    },
    header: {
      paddingTop: Platform.OS === "android" ? 55 : 20,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 34,
      fontWeight: "bold",
      color: colors.text,
    },
    // --- Styles for the Semester Pickers ---
    pickerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
      marginHorizontal: 5, // Counteract the wrapper margin
      borderRadius: 12,
      overflow: "hidden",
    },
    pickerWrapper: {
      flex: 1,
      backgroundColor: dark ? "#ccccccff" : "#FFFFFF",
      borderRadius: 12,
      marginHorizontal: 6, // Space between pickers
    },
    picker: {
      color: "#1E1E1E",
      height: 50,
    },
    // Style for the centered messages (loading, error, empty)
    centeredMessage: {
      marginTop: 60,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    dayContainer: {
      marginBottom: 24,
    },
    dayHeader: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    classCard: {
      backgroundColor: dark ? "#403d3dff" : "#FFFFFF",
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 5,
      borderLeftColor: colors.primary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: dark ? 0.25 : 0.08,
      shadowRadius: 8,
      elevation: 5,
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
      fontWeight: "500",
      color: colors.text,
      backgroundColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      overflow: "hidden",
    },
    classCardBody: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    icon: {
      marginRight: 10,
      opacity: 0.8,
    },
    infoText: {
      fontSize: 15,
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
      color: colors.notification || "#FF5252",
      textAlign: "center",
      fontSize: 16,
      lineHeight: 24,
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
    webContentWrapper: {
      backgroundColor: colors.background,
      flex: 1,
      width: "100%",
      maxWidth: 450,
      height: "100%",
      maxHeight: 812,
      borderRadius: 24,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      overflow: "hidden",
    },
  });

  // --- Web-Specific Overrides ---
  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      // On web, the safeArea becomes the main background that centers the content card
      safeArea: {
        flex: 1,
        backgroundColor: dark ? "#0a0a0a" : "#f0f2f5",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      // This new style is the "mobile screen" card that holds all content
      webContentWrapper: {
        backgroundColor: colors.background,
        flex: 1,
        width: "100%",
        maxWidth: 450,
        height: "100%",
        maxHeight: 812,
        borderRadius: 24,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        overflow: "hidden",
      },
      // The centered container must also be constrained within the web wrapper
      centered: {
        ...baseStyles.centered,
        height: "100%",
      },
      // We don't need the outer container on web, the wrapper handles it
      container: {
        flex: 1,
      },
    });
  }

  // Return base styles for mobile
  return baseStyles;
};

export const createChangePasswordStyles = (colors: any, dark: boolean) => {
  // --- Base Styles for Mobile (iOS/Android) ---
  const baseStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingTop: Platform.OS === "android" ? 20 : 40,
      paddingBottom: 24,
    },
    header: {
      paddingHorizontal: 24,
    },
    backButton: {
      position: "absolute",
      top: Platform.OS === "android" ? 30 : 0,
      left: 24,
      zIndex: 1,
      padding: 5,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
      marginTop: "20%",
    },
    subtitle: {
      fontSize: 16,
      color: colors.text + "AA", // Add some transparency
      textAlign: "center",
      marginBottom: 40,
    },
    formContainer: {
      paddingHorizontal: 24,
    },
    input: {
      backgroundColor: dark ? "rgba(255, 255, 255, 0.2)" : "#F3F4F6",
      borderRadius: 12,
      padding: 18,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      borderColor: "rgba(179, 235, 255, 0.7)",
      borderWidth: 2,
      borderRadius: 12,
      padding: 18,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
    buttonDisabled: {
      backgroundColor: dark ? "#4B5563" : "#D1D5DB", // Muted colors for disabled state
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  // --- Web-Specific Overrides ---
  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      safeArea: {
        ...baseStyles.safeArea,
        justifyContent: "center",
        alignItems: "center",
      },
      container: {
        ...baseStyles.container,
        maxWidth: 480,
        width: "100%",
        justifyContent: "center",
        paddingTop: 0,
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 40,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      },
      backButton: {
        ...baseStyles.backButton,
        top: 20,
        left: 20,
      },
      title: {
        ...baseStyles.title,
        marginTop: 0,
      },
    });
  }

  // Return base styles for mobile
  return baseStyles;
};

export const createAdvisingScreenStyles = (colors: any, dark: boolean) => {
  const baseStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 20,
      textAlign: "center",
    },
    statusCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    statusText: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 12,
    },
    detailItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    detailLabel: {
      fontSize: 15,
      color: colors.text + "99", // Muted text
    },
    detailValue: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    // --- New Styles ---
    advisingClosedContainer: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
    },
    advisingClosedText: {
      fontSize: 18,
      color: colors.text,
      textAlign: "center",
      opacity: 0.8,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    searchInput: {
      flex: 1,
      height: 50,
      color: colors.text,
      fontSize: 16,
      marginLeft: 10,
    },
    sectionHeader: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
      marginTop: 10,
    },
    courseCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
    },
    courseCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    courseId: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
    },
    courseCredit: {
      fontSize: 14,
      color: colors.text + "99",
    },
    courseTitle: {
      fontSize: 18,
      color: colors.text,
      marginTop: 8,
    },
  });

  if (Platform.OS === "web") {
    return StyleSheet.create({
      ...baseStyles,
      container: {
        ...baseStyles.container,
        maxWidth: 800,
        width: "100%",
        alignSelf: "center",
      },
    });
  }

  return baseStyles;
};
