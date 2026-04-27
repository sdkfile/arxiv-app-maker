# arxiv Demo App — Claude Code Instructions

이 프로젝트는 arxiv 논문 기반 데모 앱의 보일러플레이트입니다.

## 스택
- **프레임워크**: Next.js 15 App Router + TypeScript
- **디자인**: shadcn/ui (New York style) + Tailwind CSS + Geist 폰트
- **ORM**: Prisma + Supabase PostgreSQL
- **결제**: Polar.sh SDK
- **테마**: next-themes (다크모드 자동 지원)
- **배포**: Vercel

## 작업 규칙
1. `{{PLACEHOLDER}}` 패턴을 논문 정보로 교체
2. `/demo` 페이지에 논문 핵심 아이디어의 인터랙티브 데모 구현
3. shadcn/ui 컴포넌트 필요시 `npx shadcn@latest add [component]`로 추가
4. Prisma 스키마 수정 후 반드시 `npx prisma generate`
5. 랜딩 페이지(page.tsx)의 카피와 구조를 논문에 맞게 수정
6. SEO 메타데이터(layout.tsx)를 앱에 맞게 업데이트

## 플레이스홀더 목록

| Placeholder | 위치 | 설명 |
|---|---|---|
| `{{APP_NAME}}` | layout.tsx, README.md | 앱 이름 (영문, 짧게) |
| `{{APP_TAGLINE}}` | layout.tsx, README.md | 한 줄 설명 |
| `{{APP_HEADLINE}}` | page.tsx | 히어로 제목 (임팩트 있게) |
| `{{APP_DESCRIPTION}}` | layout.tsx, page.tsx, README.md | 2-3문장 설명 |
| `{{APP_DEMO_DESCRIPTION}}` | demo/page.tsx | 데모 페이지 설명 |
| `{{PAPER_TITLE}}` | page.tsx, README.md | 논문 제목 |
| `{{PAPER_URL}}` | page.tsx, README.md | 논문 URL |
| `{{FEATURE_1~3}}` | page.tsx | 핵심 기능 설명 |
| `{{DEPLOY_URL}}` | README.md | 배포 URL |
| `{{APP_SLUG}}` | package.json | npm 패키지명 |

## 디자인 원칙
- 미니멀, 여백 충분히
- zinc 베이스 컬러, 포인트 색상은 논문 주제에 맞게
- 모바일 우선 반응형
- 다크모드 + 라이트모드 완벽 지원 (next-themes + CSS variables)
- Geist Sans(UI) + Geist Mono(코드) 조합

## 다크모드/라이트모드 가독성 (필수)
- **모든 텍스트는 라이트/다크 양쪽에서 읽힐 수 있어야 함** — 절대로 안 보이는 글씨 없도록
- 텍스트 색상에 하드코딩된 색상(white, black, gray-900 등) 사용 금지 → CSS variable 기반 시맨틱 컬러만 사용 (foreground, muted-foreground, primary-foreground 등)
- 배경과 텍스트 간 WCAG AA 기준 대비율 4.5:1 이상 유지
- 차트/시각화 요소도 다크모드에서 선명하게 보여야 함 (밝은 색 사용)
- 테스트: 반드시 라이트모드/다크모드 양쪽에서 모든 페이지 확인 후 완료

## 파일 구조
```
src/
  app/
    layout.tsx          → 메타데이터, 폰트, ThemeProvider, JSON-LD
    page.tsx            → 랜딩 페이지 (히어로 + 기능 소개)
    demo/page.tsx       → 핵심 인터랙티브 데모
    error.tsx           → 에러 페이지
    not-found.tsx       → 404 페이지
    loading.tsx         → 로딩 스피너
    sitemap.ts          → SEO sitemap
    robots.ts           → SEO robots
    api/
      checkout/route.ts → Polar 결제 체크아웃
      webhook/route.ts  → Polar 웹훅 (서명 검증 포함)
  components/
    theme-provider.tsx  → 다크모드 제공자
    ui/                 → shadcn 컴포넌트 (button, card, input, badge)
  lib/
    utils.ts            → cn() 유틸리티
    prisma.ts           → Prisma 클라이언트 (싱글턴)
    supabase.ts         → Supabase 클라이언트
    polar.ts            → Polar.sh 결제
  middleware.ts         → 보안 헤더
prisma/
  schema.prisma         → DB 스키마 (User, Usage + 인덱스)
docs/
  SEO_STRATEGY.md       → SEO 체크리스트 + 키워드 전략
  MARKETING_STRATEGY.md → 론칭 채널 + 수익화 + 성장
```
