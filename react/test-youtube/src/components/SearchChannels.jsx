import { searchChannelsApi } from "@/api/api";
import React, { useState } from "react";

function SearchChannel({ onSelectChannel }) {
  const [channels, setChannel] = useState([]);
  const [search_q, setSearch] = useState("");

  const fetchChannels = async () => {
    try {
      const response = await searchChannelsApi.get("/search", {
        params: {
          q: search_q,
        },
      });
      setChannel(response.data.items);
    } catch (err) {
      // console.error("Error fetching channels:", error);
      console.log({
        status: err.response?.status,
        reason: err.response?.data?.error?.errors?.[0]?.reason,
        message: err.response?.data?.error?.message,
      });
    }
  };

  return (
    <div>
      <h2>SearchChannel</h2>
      <input
        value={search_q}
        onChange={(e) => setSearch(e.target.value)}
      ></input>
      <button onClick={fetchChannels}>검색</button>
      <ul>
        {channels.map((ch) => (
          <li key={ch.id?.channelId}>
            <img
              src={ch.snippet?.thumbnails?.medium?.url}
              alt={ch.snippet?.title}
            />
            <p>{ch.snippet?.title}</p>
            <button onClick={() => onSelectChannel(ch.id?.channelId)}>
              영상 보기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchChannel;
