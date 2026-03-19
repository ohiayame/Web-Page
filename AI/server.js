import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const app = express();
const PORT = 3000;

// Anthropic 클라이언트 생성 (.env의 ANTHROPIC_API_KEY 사용)
const client = new Anthropic();

app.use(express.json());
app.use(express.static("public"));

// 검색 API 엔드포인트 (SSE 스트리밍)
app.post("/api/search", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "검색어를 입력해주세요." });
  }

  // SSE 헤더 설정
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    send("status", { message: "🔍 웹 검색 중..." });

    // messages.create()로 스트리밍 메시지 전송 + web_search 도구 사용
    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        },
      ],
      messages: [
        {
          role: "user",
          content: `다음 기업의 채용정보에 대해 웹을 검색하여 **기업의 업계**, **Mission, Value, Vision**, **채용정보**의 정보를 일본어로 간략하게 답변해주세요: ${query}`,
        },
      ],
    });

    let isSearching = true;

    for await (const event of stream) {
      // 도구 사용 시작 → 검색 중 상태 표시
      if (event.type === "content_block_start" && event.content_block?.type === "tool_use") {
        send("status", { message: "🌐 검색 결과 분석 중..." });
      }

      // 텍스트 생성 시작 → 응답 시작
      if (event.type === "content_block_start" && event.content_block?.type === "text") {
        if (isSearching) {
          isSearching = false;
          send("start", {});
        }
      }

      // 텍스트 델타 스트리밍
      if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
        send("delta", { text: event.delta.text });
      }
    }

    const finalMessage = await stream.finalMessage();
    send("done", { usage: finalMessage.usage });
    res.end();
  } catch (error) {
    console.error("API 오류:", error);

    let message = "서버 오류가 발생했습니다.";
    if (error instanceof Anthropic.AuthenticationError) {
      message = "API 키가 유효하지 않습니다.";
    } else if (error instanceof Anthropic.RateLimitError) {
      message = "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
    }

    send("error", { message });
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
