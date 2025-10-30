import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default instance;