// ============================================================
// server/index.ts
// 역할: 백엔드 서버. 프론트의 요청을 받아,
//   AI_PROVIDER 설정에 따라 Claude 또는 Gemini를 호출하고,
//   결과를 프론트로 돌려준다. (API 키는 이 서버에만 숨겨둠)
//
// 실행: npm run server
// ============================================================

import express from "express";                       // 서버 프레임워크
import cors from "cors";                              // 브라우저↔서버 통신 허용
import "dotenv/config";                              // .env에서 환경변수 읽기
import path from "path";                             // 파일 경로 다루기
import { fileURLToPath } from "url";                 // 현재 파일 위치 찾기
import { callClaude } from "./providers/claude.js";  // Claude 호출 함수
import { callGemini } from "./providers/gemini.js";  // Gemini 호출 함수

// Express 앱(서버) 생성
const app = express();

// 현재 파일의 폴더 위치 (프론트 빌드 파일 경로를 찾는 데 필요)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 미들웨어
app.use(cors());          // 다른 주소(브라우저)의 요청 허용
app.use(express.json());  // 요청 본문(JSON)을 자동 해석

// ------------------------------------------------------------
// POST /api/generate
// 프론트가 프롬프트를 보내면, 설정된 AI로 처리해 답을 돌려준다.
// ------------------------------------------------------------
app.post("/api/generate", async (req, res) => {
    try {
        // 프론트가 보낸 프롬프트 꺼내기
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "prompt가 필요합니다." });
        }

        // 어떤 AI를 쓸지 결정 (.env의 AI_PROVIDER, 없으면 기본 claude)
        // ↓ 이 기본값을 바꾸면 소스에서 기본 AI를 바꾸는 셈
        const provider = process.env.AI_PROVIDER || "claude";

        let text: string;

        // provider 값에 따라 다른 AI 함수 호출
        if (provider === "gemini") {
            text = await callGemini(prompt);
        } else if (provider === "claude") {
            text = await callClaude(prompt);
        } else {
            return res
                .status(500)
                .json({ error: `알 수 없는 AI_PROVIDER: ${provider}` });
        }

        // 어떤 AI를 썼는지 로그 (디버깅용)
        console.log(`[${provider}] 응답 생성 완료`);

        // 결과를 프론트로 반환
        res.json({ text });
    } catch (err) {
        console.error("생성 실패:", err);
        res.status(500).json({ error: "생성 중 문제가 발생했습니다." });
    }
});

// ------------------------------------------------------------
// 프론트 화면 제공 (배포 시)
// npm run build로 만들어진 dist 폴더의 파일들을 서버가 뿌려준다.
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, "..", "dist")));

// 위에서 처리 안 된 나머지 요청은 화면(index.html)으로 보냄
// (req는 안 쓰므로 _req로 표시 → "안 쓰는 변수" 경고 방지)
app.use((_req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

// ------------------------------------------------------------
// 서버 시작. 배포 환경(Render)은 PORT를 주고, 없으면 3001 사용.
// ------------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});