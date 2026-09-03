// ============================================================
// providers/gemini.ts
// 역할: Gemini(Google)를 부르는 함수.
//   claude.ts와 "똑같은 모양"으로 만든다:
//   프롬프트(문자열)를 받아서 → 답변(문자열)을 돌려준다.
//   그래야 index.ts에서 둘을 바꿔 끼울 수 있다.
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini 클라이언트. 키를 직접 넣어줘야 한다(Claude와 달리 자동 아님).
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 사용할 모델. Flash 계열이 무료 등급 대상.
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

// 프롬프트를 받아 Gemini의 답변 텍스트를 돌려주는 함수.
// (Claude의 callClaude와 입출력 모양이 똑같다)
export async function callGemini(prompt: string): Promise<string> {

    const result = await model.generateContent(prompt);
    // Gemini는 result.response.text()로 답변 텍스트를 꺼낸다.
    return result.response.text();
}