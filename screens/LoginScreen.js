import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "https://chat-api-k4vi.onrender.com";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (username.trim() === "") {
      Alert.alert("Validation", "Please enter a username");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/chat/username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.detail ? errorData.detail[0].msg : "Failed to set username"
        );
        return;
      }
      const data = await response.json();
      navigation.navigate("RoomsList", {
        username: data.username,
        userId: data.id,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Removed header container */}
      <Text style={{ marginBottom: 30, fontSize: 60, color: "white" }}>
        ChatApp
      </Text>
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={24}
          color="#666"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Set Username</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ChatApp helps you connect and share with the people in your life.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1877F2", // Facebook blue background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#42b72a", // Green color for button
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  footerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
});
