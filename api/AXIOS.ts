import axios from "axios";
import { store } from "store/store";

export const AXIOS = axios.create({
  headers: {
    'User-Agent': 'RollKi/1.0 (https://github.com/MohammedMahi1/RollKi-RN.git; mohammed.mahi012@gmail.com) Axios/React-Native'
  }
});

AXIOS.interceptors.request.use((config) => {
  const state = store.getState();
  const lang = state.article?.lang || "ar";

  config.baseURL = `https://${lang}.wikipedia.org`;

  return config;
});