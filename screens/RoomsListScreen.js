import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "https://chat-api-k4vi.onrender.com";

const RoomsListScreen = ({ route, navigation }) => {
  const { username, userId } = route.params;
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chat/rooms`);
      if (!response.ok) {
        Alert.alert("Error", "Failed to fetch rooms");
        return;
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  const handleRoomSelect = (room) => {
    navigation.navigate("Chat", { username, userId, room });
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  useEffect(() => {
    fetchRooms();
    navigation.setOptions({
      headerRight: () => (
        <Button title="Logout" onPress={handleLogout} color="green" />
      ),
    });
  }, [navigation]);

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => handleRoomSelect(item)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="chatbubbles-outline" size={24} color="#1E90FF" />
      </View>
      <Text style={styles.roomText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        }}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <Text style={styles.title}>Available Chat Rooms</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomItem}
        contentContainerStyle={styles.listContainer}
      />
      <Button
        title="Create New Room"
        onPress={() => navigation.navigate("CreateRoom", { username, userId })}
        color="green"
      />
    </SafeAreaView>
  );
};

export default RoomsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    width: "100%",
    height: 180,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  roomItem: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  roomText: {
    fontSize: 16,
    color: "#333",
  },
});
