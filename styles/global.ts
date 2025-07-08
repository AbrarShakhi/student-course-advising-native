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

export const createActivateStyles = (colors: any, dark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 40,
      minHeight: height,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 32,
      width: "100%",
      maxWidth: 400,
      borderWidth: 1,
      borderColor: dark ? "#374151" : "#E5E7EB",
      ...Platform.select({
        android: {
          elevation: dark ? 8 : 4,
        },
        web: {
          boxShadow: dark
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }),
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
      ...Platform.select({
        web: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }),
    },
    subtitle: {
      fontSize: 16,
      color: colors.text + "CC",
      textAlign: "center",
      marginBottom: 32,
      ...Platform.select({
        web: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }),
    },
    form: {
      width: "100%",
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      ...Platform.select({
        web: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }),
    },
    input: {
      borderWidth: 1,
      borderColor: dark ? "#4B5563" : "#D1D5DB",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      backgroundColor: colors.card,
      color: colors.text,
      ...Platform.select({
        android: {
          elevation: dark ? 2 : 1,
        },
        web: {
          transition: "all 0.2s ease-in-out",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxShadow: dark
            ? "0 1px 2px rgba(0, 0, 0, 0.2)"
            : "0 1px 2px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      ...Platform.select({
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: `0 4px 6px -1px ${colors.primary}50, 0 2px 4px -1px ${colors.primary}30`,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
        },
      }),
    },
    buttonDisabled: {
      backgroundColor: dark ? "#6B7280" : "#9CA3AF",
      ...Platform.select({
        android: {
          elevation: 0,
        },
        web: {
          boxShadow: "none",
          cursor: "not-allowed",
        },
      }),
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      ...Platform.select({
        web: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }),
    },
  });

export const createLoginStyles = (colors: any, dark: boolean) =>
  StyleSheet.create({
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
