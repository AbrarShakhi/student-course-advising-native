import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>Welcome to your home page!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
}); 