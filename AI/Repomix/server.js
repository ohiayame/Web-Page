require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');
const https = require('https');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3001;
const anthropic = new Anthropic(); // ANTHROPIC_API_KEY 환경변수 자동 사용

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 코드 블록을 보존하며 텍스트 부분만 분리
// 반환: [{type:'text'|'code', content, lang?}]
function splitByCodeBlocks(text) {
  const parts = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', content: text.slice(last, match.index) });
    }
    parts.push({ type: 'code', content: match[0], lang: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ type: 'text', content: text.slice(last) });
  }
  return parts;
}

// POST /api/analyze — repomix로 원격 리포지토리 분석
app.post('/api/analyze', (req, res) => {
  const { url, style = 'markdown', compress = false, removeComments = false } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  const urlPattern = /^(https?:\/\/(github|gitlab|bitbucket)\.com\/[\w.\-]+\/[\w.\-]+(\.git)?|[\w.\-]+\/[\w.\-]+)$/;
  if (!urlPattern.test(url.trim())) {
    return res.status(400).json({ error: 'Invalid repository URL format. Use GitHub URL or user/repo format.' });
  }

  const tmpFile = path.join(os.tmpdir(), `repomix-${crypto.randomBytes(6).toString('hex')}.${style}`);

  const flags = [
    `--remote "${url.trim()}"`,
    `--style ${style}`,
    `--output "${tmpFile}"`,
    '--quiet',
  ];

  if (compress) flags.push('--compress');
  if (removeComments) flags.push('--remove-comments');

  const command = `npx repomix ${flags.join(' ')}`;
  console.log(`[analyze] Running: ${command}`);

  exec(command, { timeout: 120000 }, (error, _stdout, stderr) => {
    if (error) {
      console.error('[analyze] Error:', stderr || error.message);
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
      return res.status(500).json({ error: stderr || error.message });
    }

    if (!fs.existsSync(tmpFile)) {
      return res.status(500).json({ error: 'Output file was not generated.' });
    }

    const content = fs.readFileSync(tmpFile, 'utf-8');
    fs.unlinkSync(tmpFile);

    const lines = content.split('\n').length;
    const chars = content.length;

    res.json({ content, lines, chars, style });
  });
});

// POST /api/translate — SSE 스트리밍으로 번역 반환
app.post('/api/translate', async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'content is required' });
  }

  // SSE 헤더 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    // 코드 블록 보존: 텍스트 부분만 모아서 번역
    const parts = splitByCodeBlocks(content);
    const textParts = parts
      .filter(p => p.type === 'text')
      .map(p => ({ idx: parts.indexOf(p), text: p.content }));

    if (textParts.length === 0) {
      // 번역할 텍스트 없음
      sendEvent({ type: 'done', content });
      return res.end();
    }

    // 텍스트 부분들을 구분자로 합쳐 한 번에 번역 (토큰 절약)
    const SEP = '\n\n===PART_SEPARATOR===\n\n';
    const combined = textParts.map(p => p.text).join(SEP);

    const systemPrompt = `당신은 기술 문서 번역 전문가입니다.
다음 규칙을 반드시 따르세요:
1. 텍스트를 자연스러운 한국어로 번역합니다.
2. 파일 경로, 변수명, 함수명, 클래스명, URL은 번역하지 말고 그대로 유지합니다.
3. 코드 블록 내용은 번역하지 않습니다.
4. 마크다운 헤더(#, ##, ###), 구분선(---), 리스트(-) 등 마크다운 문법 구조는 유지합니다.
5. 입력에 ===PART_SEPARATOR=== 가 있으면 출력에도 동일하게 그대로 유지합니다.
6. 번역 결과만 출력하고 추가 설명은 하지 않습니다.`;

    let translated = '';

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `번역해주세요:\n\n${combined}` }],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        translated += chunk.delta.text;
        sendEvent({ type: 'chunk', text: chunk.delta.text });
      }
    }

    // 번역된 텍스트를 원래 파트 배열에 재조합
    const translatedParts = translated.split(SEP);
    let tIdx = 0;
    const result = parts.map(p => {
      if (p.type === 'code') return p.content;
      const t = translatedParts[tIdx] ?? p.content;
      tIdx++;
      return t;
    });

    sendEvent({ type: 'done', content: result.join('') });
  } catch (err) {
    console.error('[translate] Error:', err.message);
    sendEvent({ type: 'error', error: err.message });
  }

  res.end();
});

// GitHub API 헬퍼
function githubGet(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'repomix-web',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// 언어별 대표 레포 선택 헬퍼
function selectRepos(repos) {
  const nonForkRepos = repos.filter(r => !r.fork);
  const targetRepos = nonForkRepos.length > 0 ? nonForkRepos : repos;

  const langMap = {};
  for (const repo of targetRepos) {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + (repo.size || 1);
    }
  }

  const topLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang);

  const selected = [];
  const used = new Set();

  for (const lang of topLangs) {
    const candidate = targetRepos
      .filter(r => r.language === lang && !used.has(r.full_name))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
    if (candidate) { selected.push(candidate); used.add(candidate.full_name); }
  }

  for (const repo of [...targetRepos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))) {
    if (selected.length >= 5) break;
    if (!used.has(repo.full_name)) { selected.push(repo); used.add(repo.full_name); }
  }

  return { selected: selected.slice(0, 5), all: targetRepos, langMap };
}

// GET /api/get-repos — 레포 목록 + 추천 선택 반환 (확인 단계용)
app.post('/api/get-repos', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });

  try {
    const repos = await githubGet(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
    if (!Array.isArray(repos)) return res.status(400).json({ error: repos.message || 'GitHub API 오류' });

    const { selected, all } = selectRepos(repos);

    res.json({
      selected: selected.map(r => ({ full_name: r.full_name, language: r.language, description: r.description, updated_at: r.updated_at })),
      all: all.map(r => ({ full_name: r.full_name, language: r.language, description: r.description, updated_at: r.updated_at })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/analyze-user — 선택된 레포 Repomix 분석 + Claude 평가
app.post('/api/analyze-user', async (req, res) => {
  const { username, repos: selectedRepoNames } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'GitHub username is required' });
  }
  if (!Array.isArray(selectedRepoNames) || selectedRepoNames.length === 0) {
    return res.status(400).json({ error: '분석할 레포지토리를 선택해주세요.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const topRepos = selectedRepoNames.map(name => ({ full_name: name, description: '' }));

    // Repomix 실행
    const repomixResults = [];
    for (const repo of topRepos) {
      sendEvent({ type: 'status', message: `${repo.full_name} 코드 분석 중... (Repomix)` });
      const tmpFile = path.join(os.tmpdir(), `repomix-${crypto.randomBytes(6).toString('hex')}.md`);
      await new Promise((resolve) => {
        exec(
          `npx repomix --remote "${repo.full_name}" --compress --style markdown --output "${tmpFile}" --quiet`,
          { timeout: 120000 },
          (error) => {
            if (!error && fs.existsSync(tmpFile)) {
              const content = fs.readFileSync(tmpFile, 'utf-8');
              fs.unlinkSync(tmpFile);
              repomixResults.push({ repo: repo.full_name, description: repo.description || '', content: content.slice(0, 25000) });
            } else {
              repomixResults.push({ repo: repo.full_name, description: repo.description || '', content: '(코드 로딩 실패)' });
              if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
            }
            resolve();
          }
        );
      });
    }

    // 5. Claude 분석
    sendEvent({ type: 'status', message: 'AI가 기술 스택과 이해도를 분석 중...' });

    const repoSummary = repomixResults
      .map(r => `=== 레포: ${r.repo} ===\n설명: ${r.description}\n\n${r.content}`)
      .join('\n\n---\n\n');

    const analyzedRepoNames = repomixResults.map(r => r.repo);

    const prompt = `GitHub 사용자 "${username}"의 코드를 분석해서 기술 스택과 이해도를 평가해주세요.

## Repomix로 분석한 레포지토리 목록
${analyzedRepoNames.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## 각 레포지토리 코드
${repoSummary}

반드시 아래 JSON 형식으로만 응답하세요. JSON 외 다른 텍스트는 절대 포함하지 마세요:
{
  "summary": "이 개발자에 대한 한 줄 요약",
  "skills": [
    {
      "name": "기술명 (예: Python, React, Node.js, MySQL 등)",
      "category": "language 또는 framework 또는 tool 또는 database",
      "level": 1에서 5 사이의 정수,
      "repos": ["이 기술이 발견된 레포 이름 (user/repo 형식)", ...],
      "evidence": "코드에서 발견한 구체적 근거 (어떤 패턴, 구조, 라이브러리를 사용했는지)"
    }
  ]
}

## 평가 기준 (코드 증거 기반으로 엄격하게)
- 5: 디자인 패턴 적용, 커스텀 예외처리, 성능 최적화, 테스트 코드 작성
- 4: 클래스/모듈 분리, 재사용 가능한 함수 설계, 적절한 에러 핸들링
- 3: 기능은 동작하나 단일 파일 위주, 기본 구조만 있음
- 2: 튜토리얼 수준, 변수/조건문/반복문 기본 사용
- 1: 몇 줄짜리 스크립트, 단순 복붙 수준

언어, 프레임워크, 주요 라이브러리, 도구, DB 등 모두 포함해서 평가하세요.
반드시 코드에서 실제로 발견한 증거만 근거로 삼으세요.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const fullText = message.content[0].text;
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      sendEvent({ type: 'error', error: 'AI 응답 파싱 실패' });
      return res.end();
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      // JSON이 잘렸을 경우 skills 배열을 복구 시도
      console.warn('[analyze-user] JSON parse failed, attempting repair:', parseErr.message);
      const repaired = jsonMatch[0]
        .replace(/,\s*$/, '')           // 마지막 쉼표 제거
        .replace(/,\s*\]/, ']')         // 배열 끝 쉼표 제거
        .replace(/,\s*\}/, '}');        // 객체 끝 쉼표 제거

      // 불완전한 마지막 skill 객체 제거 후 배열 닫기
      const fixedJson = repaired.replace(/,?\s*\{[^}]*$/, '') + ']}';
      try {
        result = JSON.parse(fixedJson);
      } catch {
        sendEvent({ type: 'error', error: 'AI 응답 파싱 실패 — 다시 시도해주세요.' });
        return res.end();
      }
    }
    sendEvent({ type: 'done', result, username, analyzedRepos: analyzedRepoNames });
  } catch (err) {
    console.error('[analyze-user] Error:', err.message);
    sendEvent({ type: 'error', error: err.message });
  }

  res.end();
});

app.listen(PORT, () => {
  console.log(`Repomix Web running at http://localhost:${PORT}`);
});
