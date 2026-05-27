import axios from "axios";

export const AXIOS = axios.create({
  baseURL: "https://en.wikipedia.org/api/rest_v1/", 
});