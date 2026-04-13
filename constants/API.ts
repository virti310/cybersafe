import { Platform } from "react-native";

// For Android Emulator, use 10.0.2.2.
// For physical device, use your machine's local IP address (e.g., 192.168.1.5).
// For iOS Simulator, localhost is fine.
// Replace '10.0.2.2' with your actual local IP if using a physical device.

const API_URL = Platform.select({
  android: "http://172.16.24.246:3000/api", // Use actual local IP instead of 10.0.2.2 for physical device testing
  ios: "http://172.16.24.246:3000/api", // Use actual local IP instead of localhost for physical device testing
  web: "http://localhost:3000/api", // Web uses localhost
  default: "http://172.16.24.246:3000/api", // Fallback to local IP
});

export default API_URL;
// android: "http://192.168.251.224:3000/api",