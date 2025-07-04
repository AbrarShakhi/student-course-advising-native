import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Placeholder for login logic
  const handleLogin = () => {
    // In the future, add authentication here
    // For now, just navigate to /home
    router.replace("/home");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ width: 250, height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 16, paddingHorizontal: 8 }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ width: 250, height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 24, paddingHorizontal: 8 }}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
