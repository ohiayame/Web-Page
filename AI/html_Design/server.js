require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3002;
const anthropic = new Anthropic();

const OUTPUT_DIR = path.join(__dirname, 'output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/output', express.static(OUTPUT_DIR));

// POST /api/generate
// body: { pageInfo, styleInfo }
// returns: { html, recreatePrompt, filename }
app.post('/api/generate', async (req, res) => {
  const { pageInfo, styleInfo } = req.body;
  if (!pageInfo || !styleInfo) {
    return res.status(400).json({ error: '페이지 정보와 스타일 정보를 모두 입력해주세요.' });
  }

  // Set SSE headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    send('status', { message: 'HTML 파일 생성 중...' });

    // Step 1: Generate HTML
    let htmlContent = '';
    const htmlStream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 50000,
      messages: [
        {
          role: 'user',
          content: `당신은 전문 웹 디자이너입니다. 아래 정보를 바탕으로 완전한 HTML 파일을 생성해주세요.

## 페이지 정보 및 데이터
${pageInfo}

## 디자인 / 스타일 요구사항
${styleInfo}

## 지시사항
- 완전한 단일 HTML 파일로 작성 (CSS는 <style> 태그 내부, JS는 <script> 태그 내부)
- 외부 CDN은 허용 (예: Tailwind, Font Awesome, Google Fonts 등)
- css가 길어지지 않게 외부 CDN을 활용해서 최적화
- 페이지 정보 및 데이터가 상세하지 않은 경우 한 묶음의 데이터는 최데 3개 까지
- 반응형 디자인 허용
- 실제 데이터와 스타일이 잘 반영된 아름다운 페이지 생성
- HTML 코드만 출력 (설명 없이)

\`\`\`html 블록으로 감싸서 출력해주세요.`
        }
      ]
    });

    for await (const chunk of htmlStream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        htmlContent += chunk.delta.text;
        send('html_chunk', { text: chunk.delta.text });
      }
    }

    // Extract HTML from code block
    const htmlMatch = htmlContent.match(/```html\n([\s\S]*?)```/);
    const cleanHtml = htmlMatch ? htmlMatch[1].trim() : htmlContent.trim();

    send('status', { message: '재현 프롬프트 생성 중...' });

    // Step 2: Generate recreate prompt
    let promptContent = '';
    const promptStream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 30000,
      messages: [
        {
          role: 'user',
          content: `아래 HTML 페이지를 처음부터 완전히 동일하게 재현할 수 있는 프롬프트를 작성해주세요.

## 생성된 HTML
${cleanHtml}

## 요구사항
- 이 프롬프트만 보고도 동일한 디자인의 HTML을 생성할 수 있어야 함
- 레이아웃, 색상, 폰트, 컴포넌트 구조 등 디자인 세부사항 포함
- 사용된 데이터/콘텐츠 구조 포함
- 기술 스택 및 외부 라이브러리 명시
- 한국어로 작성
- 프롬프트만 출력 (부가 설명 없이)`
        }
      ]
    });

    for await (const chunk of promptStream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        promptContent += chunk.delta.text;
        send('prompt_chunk', { text: chunk.delta.text });
      }
    }

    // Save HTML file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `design_${timestamp}.html`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, cleanHtml, 'utf8');

    send('done', {
      filename,
      downloadUrl: `/output/${filename}`,
      recreatePrompt: promptContent.trim()
    });
    res.end();

  } catch (err) {
    console.error(err);
    send('error', { message: err.message || '서버 오류가 발생했습니다.' });
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`HTML Design Generator running at http://localhost:${PORT}`);
});
