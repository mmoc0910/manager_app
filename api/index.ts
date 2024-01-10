import axios from "axios";

export const BASE_USRL = 'http://192.168.0.105:5000/api';
export const api = axios.create({
    baseURL: BASE_USRL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  