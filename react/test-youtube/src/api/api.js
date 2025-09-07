import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
// console.log("API_KEY:", API_KEY);

export const searchChannelsApi = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: {
    part: "snippet",
    maxResults: 1,
    key: API_KEY,
    type: "channel",
  },
});

export const SearchVideoApi = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: {
    part: "snippet",
    maxResults: 10,
    key: API_KEY,
    type: "video",
  },
});
