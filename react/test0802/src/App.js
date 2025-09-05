import React, { useState, useEffect } from "react";
import api from "./api/api";

function App() {
  const [channels, setChannel] = useState([]);
  const [search_q, setSearch] = useState([]);

  const fetchVideos = async () => {
    try {
      const response = await api.get("/search", {
        params: {
          q: search_q,
        },
      });
      setChannel(response.data.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleChannel = (channelId) => {
    console.log(channelId);
  };

  console.log(channels);
  return (
    <div>
      <h2>YouTube Clone</h2>
      <input
        value={search_q}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      <button onClick={fetchVideos}>검색</button>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id.videoId}>
            <img
              src={channel.snippet.thumbnails.medium.url}
              alt={channel.snippet.title}
            />
            <p>{channel.snippet.channelTitle}</p>
            <button onClick={() => handleChannel(channel.snippet.channelId)}>
              MyList 추가
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
