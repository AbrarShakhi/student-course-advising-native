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
      paddingTop: Platform.OS === "android" ? 60 : 40,
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
      paddingBottom: 24,
    },
    input: {
      backgroundColor: dark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
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
