import { Platform } from 'react-native';

// For Android Emulator, use 10.0.2.2. 
// For physical device, use your machine's local IP address (e.g., 192.168.1.5).
// For iOS Simulator, localhost is fine.
// Replace '10.0.2.2' with your actual local IP if using a physical device.

const API_URL = Platform.select({
    android: 'http://10.0.2.2:3000/api', // Emulator Localhost Access
    ios: 'http://localhost:3000/api', // iOS Simulator uses localhost
    web: 'http://localhost:3000/api', // Web uses localhost
    default: 'http://10.0.2.2:3000/api', // Fallback to Emulator IP
});

export default API_URL;