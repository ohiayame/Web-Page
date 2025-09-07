import { SearchVideoApi } from "@/api/api";
import { useEffect, useState } from "react";

function SearchVideo({ channelId }) {
  const [videos, setVideo] = useState([]);
  console.log("channelId:", channelId);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await SearchVideoApi.get("/search", {
          params: {
            channelId: channelId,
          },
        });
        setVideo(response.data.items);
      } catch (err) {
        // console.error("Error fetching videos:", error);
        console.log({
          status: err.response?.status,
          reason: err.response?.data?.error?.errors?.[0]?.reason,
          message: err.response?.data?.error?.message,
        });
      }
    };
    fetchVideos();
  }, [channelId]); // 의존성 배열

  console.log(videos);
  return (
    <div>
      <h2>SearchVideo</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id.videoId}>
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
            />
            <p>{video.snippet.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default SearchVideo;
