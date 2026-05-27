import axios from "axios";

export const AXIOS = axios.create({
  baseURL: "https://en.wikipedia.org/api/rest_v1/",
  headers: {
    'User-Agent': 'RollKi/1.0 (https://github.com/MohammedMahi1/RollKi-RN.git; mohammed.mahi012@gmail.com) Axios/React-Native'
  }
});