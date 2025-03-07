import React, { useState, useEffect } from "react";
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

const CreateRoomScreen = ({ route, navigation }) => {
  const { username, userId } = route.params;
  const [roomName, setRoomName] = useState("");

  const handleCreateRoom = async () => {
    if (roomName.trim() === "") {
      Alert.alert("Validation", "Please enter a room name");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/chat/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.detail ? errorData.detail[0].msg : "Failed to create room"
        );
        return;
      }
      const roomData = await response.json();
      navigation.navigate("Chat", { username, userId, room: roomData });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Text style={styles.headerButtonText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="add-circle-outline"
            size={36}
            color="#42b72a"
            style={styles.buttonIcon}
          />
          <Text style={styles.title}>Create New Room</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Room Name"
            placeholderTextColor="#999"
            value={roomName}
            onChangeText={setRoomName}
          />
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateRoom}
        >
          <Text style={styles.createButtonText}>Create Room</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1877F2", // Facebook Blue background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#42b72a", // Green button
    paddingVertical: 12,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    backgroundColor: "#42b72a", // Green header button
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
