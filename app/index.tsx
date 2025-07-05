import { useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";

import { createHomeStyles } from "@/styles/global";


export default function HomeScreen() {
  const { colors, dark } = useTheme();
  const styles = createHomeStyles(colors, dark);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>Welcome to your home page!</Text>
    </View>
  );
}

