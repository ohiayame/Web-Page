import { useEffect, useState } from "react";

// OAuth 클라이언트 ID
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// Gooogle Cloud에서 등록한 리디렉션 URI
const REDIRECT_URI = "http://localhost:5173/callback";
const SCOPE = "profile email https://www.googleapis.com/auth/youtube.readonly";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  // 1. 로그인 버튼 클릭 시 Google OAuth로 리디렉션
  const handleLogin = () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}` +
      `&response_type=token&scope=${encodeURIComponent(SCOPE)}`;
    window.location.href = authUrl;
  };

  // 2. URL 해시에서 access_token 추출(리다이랙트 시 넘어옴)
  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const token = params.get("access_token");
      if (token) setAccessToken(token);
    }
  }, []);

  // 3. access_token으로 구독 목록 가져오기
  useEffect(() => {
    if (!accessToken) return;

    // 프로필 정보 조회
    const fetchProfile = async () => {
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(await res.json());
    };

    // 구독정보 조회
    const fetchSubscriptions = async () => {
      const res = await fetch(
        // subscriptions : YouTube ユーザーの定期購入に関する情報
        // mine=true : 認証されたユーザーの登録チャンネルのフィードを取得
        "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true",
        // OAuth 2.0 トークンを指定する必要がある -> HTTP Authorization ヘッダーを使用
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // リソースは JSON オブジェクトとして表される
      const data = await res.json();
      setSubscriptions(data.items || []);
    };
    
    fetchProfile();
    fetchSubscriptions();
  }, [accessToken]);

  console.log(profile);

  return (
    <div>
      {!accessToken && <button onClick={handleLogin}>Google 로그인</button>}

      {profile && (
        <div>
          <img src={profile.picture} alt={profile.name} />
          <h3>{profile.name}</h3>
          <p>{profile.email}</p>
        </div>
      )}

      {subscriptions.length > 0 && (
        <ul>
          {subscriptions.map((sub) => (
            <li key={sub.id}>
              <img
                src={sub.snippet.thumbnails.default.url}
                alt={sub.snippet.title}
              />
              {sub.snippet.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
