// ============================================================
// providers/claude.ts
// 역할: Claude(Anthropic)를 부르는 함수.
//   프롬프트(문자열)를 받아서 → Claude 답변(문자열)을 돌려준다.
//   "어떤 AI를 쓸지"는 여기서 신경 안 쓴다. 그냥 Claude만 담당.
// ============================================================

import Anthropic from "@anthropic-ai/sdk";

// Anthropic 클라이언트. process.env.ANTHROPIC_API_KEY를 자동으로 사용.
const client = new Anthropic();

// 프롬프트를 받아 Claude의 답변 텍스트를 돌려주는 함수.
export async function callClaude(prompt: string): Promise<string> {
    const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
    });

    // 응답에서 텍스트 블록만 골라 이어붙임
    return message.content
        .filter((b) => b.type === "text")
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("\n");
}