import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import React from "react";

// Import the new styles
import { createAppLayoutStyles } from "@/styles/global"; // Assuming global.ts contains the new styles

// Import your screen components
import accountScreen from "./accountScreen";
import advisingScreen from "./advisingScreen";
import homeScreen from "./homeScreen";

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  const { colors, dark } = useTheme();
  const styles = createAppLayoutStyles(colors, dark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header for all screens
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Advising") {
            iconName = focused ? "school" : "school-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={21} color={color} />;
        },
        tabBarIconStyle: styles.tabBarIcon,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveTintColor: styles.tabBarIndicatorStyle.backgroundColor, // Use primary color for active icon/text
        tabBarInactiveTintColor: colors.text + "80", // Slightly transparent text for inactive
        tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is open
      })}
    >
      {/* --- Define the Screens for each tab --- */}
      <Tab.Screen name="Home" component={homeScreen} />
      <Tab.Screen name="Advising" component={advisingScreen} />
      <Tab.Screen name="Account" component={accountScreen} />
    </Tab.Navigator>
  );
}
