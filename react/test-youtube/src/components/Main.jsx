import SearchChannel from "@/components/SearchChannels";
import SearchVideo from "@/components/SearchVideo";
import { useState } from "react";

function Main() {
  // ./components/SearchChannel에서 받은 channelId를 세트
  const [channelId, setChannelId] = useState(null);

  const handleSelectChannel = (id) => {
    setChannelId(id);
  };

  return (
    <>
      <h1>Test Youtube</h1>
      <SearchChannel onSelectChannel={handleSelectChannel} />
      <hr />
      {channelId && <SearchVideo channelId={channelId} />}
    </>
  );
}

export default Main;
