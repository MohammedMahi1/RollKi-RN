import axios from "axios";

// Extend Axios's internal configuration interface to support our custom lang prop safely
declare module 'axios' {
  export interface AxiosRequestConfig {
    lang?: "ar" | "en" | "fr";
  }
}

// Safely pull variables from process.env
const appName = process.env.EXPO_PUBLIC_USER_AGENT_APP_NAME || "RollKi/1.0";
const repoUrl = process.env.EXPO_PUBLIC_USER_AGENT_REPO || "";
const email = process.env.EXPO_PUBLIC_USER_AGENT_CONTACT || "";

// Construct a clean User-Agent string meeting Wikipedia's API usage policy guidelines
const userAgentHeader = `${appName} (${repoUrl}; ${email}) Axios/React-Native`;

export const AXIOS = axios.create({
  headers: {
    'User-Agent': userAgentHeader
  }
});

AXIOS.interceptors.request.use((config) => {
  const lang = config.lang || "ar";

  config.baseURL = `https://${lang}.wikipedia.org`;

  return config;
});