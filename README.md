# MyChatApp

A React Native chat application that uses a Facebook Messenger–like UI and integrates with a Node.js/Express WebSocket and REST API. This project supports real-time messaging, room creation, and user logins.

## Features

- **Facebook-Inspired UI:** Light grey background, blue header, green “Send” button, and chat bubbles.
- **WebSocket Integration:** Real-time chat with auto-reconnect logic for dropped connections.
- **Room Management:** Create rooms, join rooms, and fetch the last 10 messages for each room.
- **Authentication:** Login screen sets a username, with a unique user ID assigned by the backend.
- **Join/Leave Messages:** Sends a “join” event when entering a room and a “leave” event on logout or room exit.

---

## Prerequisites

- **Node.js** (version 14 or higher recommended)
- **npm** or **yarn** for dependency management
- **Expo CLI** (if you plan to run with Expo) or React Native CLI if using the bare workflow

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/MyChatApp.git
   cd MyChatApp
   ```
2. Install Dependencies:
   Using npm:

```npm install

```

3. Start the Metro Bundler:

```
expo start
```
