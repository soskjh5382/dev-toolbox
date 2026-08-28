# 🛠️ 개발자 AI 도구상자

> 자주 쓰는 개발 작업을 AI에게 맡기는 웹 도구 모음.
> Claude / Gemini를 설정값 하나로 전환할 수 있습니다.

**🔗 라이브 데모:** https://dev-toolbox-mckc.onrender.com

> ⚠️ 무료 호스팅이라 첫 접속 시 서버를 깨우느라 30초~1분 걸릴 수 있습니다.

<!-- 여기에 스크린샷을 넣으면 좋습니다 (아래 "스크린샷 넣는 법" 참고) -->

---

## 어떤 도구가 있나

| 도구 | 입력 | 결과 |
|------|------|------|
| 커밋 메시지 | git diff | Conventional Commits 형식 메시지 |
| 에러 해설 | 스택트레이스 | 뜻 · 원인 · 해결법 |
| 정규식 | 요구사항 설명 | 정규식 + 예시 |
| 코드 설명 | 코드 | 단계별 설명 |
| SQL 설명 | 쿼리 | 동작 + 성능 주의점 |
| cron 생성 | "매주 월요일 9시" | cron 표현식 + 실행 예시 |
| 테스트 생성 | 함수 | 단위 테스트 초안 |
| JSON 정리 | 엉망 JSON | 포맷팅 + 구조 설명 |

---

## 기술 스택

**프론트엔드**
- React + TypeScript, Vite
- react-markdown — AI 답변의 마크다운 렌더링

**백엔드**
- Node.js + Express + TypeScript
- API 키를 서버에만 두고 AI를 중계 (브라우저에 키 노출 방지)

**AI 제공자 (전환 가능)**
- Claude (Anthropic)
- Gemini (Google, 무료 등급)

**배포**
- Render (GitHub 연동 자동 배포)

---

## 구조
```
[브라우저] [Node 서버] [AI]
React + TS ──→ Express + TS ──→ Claude
(화면/8개 도구) (키 숨김 + 분기) 또는 Gemini
│
AI_PROVIDER 값으로
Claude/Gemini 선택
```

프론트는 `/api/generate`만 호출하고, 실제 AI 호출은 서버가 담당합니다.
이 분리 덕분에 **AI 제공자를 바꿔도 프론트는 건드리지 않습니다.**

---

## 설계에서 신경 쓴 점

**1. API 키 보호**
브라우저에서 AI를 직접 부르면 키가 노출됩니다. 서버가 중간에서 키를 붙여 대신 호출합니다.

**2. AI 제공자 전환**
`AI_PROVIDER` 값(`claude` / `gemini`) 하나로 전체 AI를 전환합니다. 각 AI 호출 코드를 `providers/`에 같은 모양의 함수로 분리해, 서버는 골라 부르기만 합니다.

**3. 도구 = 프롬프트 차이뿐**
8개 도구가 UI와 호출 로직을 공유하고 프롬프트만 다릅니다. `TOOLS` 배열에 항목을 추가하면 새 탭이 자동 생성됩니다.

**4. 프롬프트 인젝션 방어**
사용자 입력을 `<user_input>` 태그로 감싸 "데이터일 뿐"임을 명시하고, 각 도구가 용도 외 요청은 거절하도록 했습니다.

---

## 폴더 구조
```
dev-toolbox/
├── src/
│ └── App.tsx 프론트 화면 (8개 도구 탭)
├── server/
│ ├── index.ts 서버 진입점 (요청 받고 AI 분기)
│ └── providers/
│ ├── claude.ts Claude 호출 함수
│ └── gemini.ts Gemini 호출 함수
├── .env API 키 + AI_PROVIDER (git 미포함)
├── package.json
└── vite.config.ts
```

---

## 로컬 실행

```bash
# 1. 패키지 설치
npm install

# 2. .env 파일 생성 (아래 참고)

# 개발 모드 (프론트/서버 따로)
npm run server   # 백엔드 localhost:3001
npm run dev      # 프론트 localhost:5173

# 배포 모드 (서버가 화면도 제공)
npm run build
npm run server   # localhost:3001
```

**.env 예시:**

ANTHROPIC_API_KEY=your_claude_key
GEMINI_API_KEY=your_gemini_key
AI_PROVIDER=gemini
