import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const WS_BASE_URL = "wss://chat-api-k4vi.onrender.com";

const ChatScreen = ({ route, navigation }) => {
  const { username, userId, room } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const ws = useRef(null);
  const shouldReconnect = useRef(true);

  // -----------------------
  // 1. Fetch last 10 messages
  // -----------------------
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://chat-api-k4vi.onrender.com/chat/rooms/${room.id}/messages`
      );
      if (!response.ok) {
        Alert.alert("Error", "Failed to fetch messages");
        return;
      }
      const data = await response.json();

      // data might come in descending order (newest first).
      // Reverse so oldest is at index 0 and newest at the end:
      const lastTenAscending = data.slice(-10).reverse();

      setMessages(lastTenAscending);
    } catch (error) {
      console.error("Fetch messages error:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  // -----------------------
  // 2. WebSocket connection logic
  // -----------------------
  const connectWebSocket = useCallback(() => {
    const wsUrl = `${WS_BASE_URL}/ws/${room.id}/${username}`;
    console.log("Connecting to WebSocket URL:", wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
      // Automatically send a join message on open
      const joinMsg = {
        event: "join",
        content: `${username} has joined the chat`,
        username,
      };
      ws.current.send(JSON.stringify(joinMsg));
    };

    ws.current.onmessage = (e) => {
      try {
        const messageData = JSON.parse(e.data);
        console.log("Received message:", messageData);

        // Ignore "join" events
        if (messageData.event === "join") {
          return;
        }

        // If message is nested under "message", extract it
        if (messageData.event === "message" && messageData.message) {
          // Appending new messages at the end of the array
          setMessages((prev) => [...prev, messageData.message]);
        } else {
          // Or if it's just an object with { event, username, content }
          setMessages((prev) => [...prev, messageData]);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error:", e.message);
    };

    ws.current.onclose = (e) => {
      console.log("WebSocket closed:", e.code, e.reason);
      if (shouldReconnect.current) {
        console.log("Attempting to reconnect in 3 seconds...");
        setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };
  }, [room.id, username]);

  // -----------------------
  // 3. Set up on mount
  // -----------------------
  useEffect(() => {
    shouldReconnect.current = true;
    fetchMessages();
    connectWebSocket();

    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={handleLeaveGroup}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Leave Group</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });

    return () => {
      shouldReconnect.current = false;
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectWebSocket, navigation]);

  // -----------------------
  // 4. Send message
  // -----------------------
  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    const messagePayload = {
      event: "message",
      content: inputMessage,
      username,
    };
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(messagePayload));
      setInputMessage("");
    } else {
      Alert.alert("Error", "WebSocket connection is not open.");
    }
  };

  // -----------------------
  // 5. Leave group
  // -----------------------
  const handleLeaveGroup = () => {
    const leaveMsg = {
      event: "leave",
      content: `${username} has left the room`,
      username,
    };
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(leaveMsg));
    }
    ws.current?.close();
    navigation.navigate("RoomsList", { username, userId });
  };

  // -----------------------
  // 6. Logout
  // -----------------------
  const handleLogout = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const leaveMsg = {
        event: "leave",
        content: `${username} has left the room`,
        username,
      };
      ws.current.send(JSON.stringify(leaveMsg));
      ws.current.close();
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  // -----------------------
  // 7. Render each message
  // -----------------------
  const renderMessageItem = ({ item }) => {
    const isOwnMessage = item.username === username;
    return (
      <View
        style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {!isOwnMessage && (
          <Text style={styles.senderName}>{item.username}</Text>
        )}
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };

  // -----------------------
  // 8. Main component render
  // -----------------------
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.roomTitle}>Room: {room.name}</Text>
      <FlatList
        style={styles.messagesList}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

// ---------------------------------------------------
// 9. Some basic styles
// ---------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Light grey background (FB Messenger style)
  },
  roomTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    backgroundColor: "#1877F2",
    color: "#fff",
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: "80%",
  },
  ownBubble: {
    backgroundColor: "#d2f8d2",
    alignSelf: "flex-end",
  },
  otherBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1877F2",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: "#42b72a", // Green button
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerButton: {
    backgroundColor: "#42b72a",
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
