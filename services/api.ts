import { Platform } from 'react-native';

import API_URL_CONST from '../constants/API';

export const API_URL = API_URL_CONST;

export const api = {
    // Helper for requests
    async request(endpoint: string, method: string = 'GET', body?: any, customHeaders: Record<string, string> = {}) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        let requestBody = body;

        // If body is FormData, let the browser set Content-Type
        if (body instanceof FormData) {
            delete headers['Content-Type'];
            requestBody = body;
        } else if (body && typeof body === 'object') {
            requestBody = JSON.stringify(body);
        }

        const config: RequestInit = {
            method,
            headers: headers as HeadersInit,
            body: requestBody,
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Request failed with status ${response.status}`);
            }
            // For delete/put sometimes we might not get json back if status 204
            if (response.status === 204) return null;
            return await response.json();
        } catch (error) {
            console.error(`API Error ${method} ${endpoint}:`, error);
            throw error;
        }
    },

    get: (endpoint: string) => api.request(endpoint, 'GET'),
    post: (endpoint: string, body: any, headers?: Record<string, string>) => api.request(endpoint, 'POST', body, headers),
    put: (endpoint: string, body: any, headers?: Record<string, string>) => api.request(endpoint, 'PUT', body, headers),
    delete: (endpoint: string) => api.request(endpoint, 'DELETE'),
};
