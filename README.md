# arxiv-app-pipeline

arxiv 최신 논문 → LLM 필터링 → Discord 알림 → 앱 자동 생성 파이프라인

## 아키텍처

```
Cron → arxiv-cli → Claude API 필터 → Discord 웹훅
Discord 인터랙션 → Dispatch Server → Claude Code CLI → GitHub + 배포
```

## 설정

```bash
npm install
cp .env.example .env
# .env 파일에 API 키 입력
```

### 필수 도구
- [arxiv-cli](https://github.com/whitphx/arxiv-cli) (`cargo install arxiv-cli`)
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (`npm i -g @anthropic-ai/claude-code`)
- [gh CLI](https://cli.github.com/) (GitHub repo 생성용)

## 사용

### 일일 파이프라인 (수집 → 필터 → 알림)
```bash
npm run pipeline
```

### 개별 실행
```bash
npm run collect        # arxiv 논문 수집
npm run filter         # LLM 스코어링
npm run notify         # Discord 알림 전송
```

### Dispatch 서버 (Discord 인터랙션 수신)
```bash
npm run server         # production
npm run dev            # dev (watch mode)
```

## 구조

```
collector/   arxiv-cli wrapper + 스케줄러
filter/      Claude API 스코어링
bot/         Discord 웹훅 + 인터랙션 서버
generator/   Claude Code CLI 디스패치 + 후처리
  templates/ 플랫폼별 프롬프트 (nextjs, ios, watchos, macos, react-native, cli, chrome-ext)
deploy/      Docker + GCP + cloudflared 설정
```
