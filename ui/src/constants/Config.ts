// src/constants/config.ts
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('API_URL is not defined! Check your .env file.');
}
