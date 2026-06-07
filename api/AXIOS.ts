import axios from "axios";

// Extend Axios's internal configuration interface to support our custom lang prop safely
declare module 'axios' {
  export interface AxiosRequestConfig {
    lang?: "ar" | "en" | "fr";
  }
}

export const AXIOS = axios.create({
  headers: {
    'User-Agent': 'RollKi/1.0 (https://github.com/MohammedMahi1/RollKi-RN.git; mohammed.mahi012@gmail.com) Axios/React-Native'
  }
});

AXIOS.interceptors.request.use((config) => {
  const lang = config.lang || "ar";

  config.baseURL = `https://${lang}.wikipedia.org`;

  return config;
});