import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AdvisingScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the advisingScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
