import axios from 'axios';
import API_URL from '../constants/API';

const BASE_URL = API_URL;

export const sendMessageToBot = async (message: string, history: any[] = []) => {
    try {
        const response = await axios.post(`${BASE_URL}/chat`, {
            message,
            history
        });
        return response.data.response;
    } catch (error: any) {
        console.error("Error sending message to bot:", error.message);
        if (error.response) {
            console.error("Server responded with:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("No response received (Network Error):", error.request);
        } else {
            console.error("Error setting up request:", error.message);
        }
        throw error;
    }
};
