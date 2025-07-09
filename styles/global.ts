import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const createHomeStyles = (colors: any, theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 16,
      color: colors.text,
    },
    subtitle: {
      fontSize: 18,
      color: colors.text + "AA",
      textAlign: "center",
    },
  });

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
