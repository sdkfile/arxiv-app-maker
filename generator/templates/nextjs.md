논문 정보:
- 제목: {{title}}
- 초록: {{abstract}}
- 카테고리: {{categories}}
- 원문: {{paper_url}}

이 프로젝트는 위 논문의 핵심 아이디어를 데모하는 Next.js 웹 앱의 보일러플레이트입니다.
shadcn/ui + Tailwind + Prisma + Supabase + Polar.sh가 이미 세팅되어 있습니다.

CLAUDE.md를 먼저 읽고 프로젝트 구조를 파악하세요.

당신이 해야 할 것:

1. **플레이스홀더 교체**: layout.tsx, page.tsx의 {{PLACEHOLDER}} 패턴을 논문 정보 기반으로 교체
   - APP_NAME: 앱 이름 (영문, 짧고 기억하기 쉽게)
   - APP_TAGLINE: 한 줄 설명
   - APP_HEADLINE: 히어로 제목 (임팩트 있게)
   - APP_DESCRIPTION: 2-3문장 설명
   - PAPER_TITLE, PAPER_URL: 논문 정보
   - FEATURE_1~3: 핵심 기능 설명

2. **데모 페이지 구현** (src/app/demo/page.tsx):
   - 논문의 핵심 알고리즘/개념을 인터랙티브하게 체험할 수 있는 UI
   - 입력 → 처리 → 시각적 결과 흐름
   - shadcn/ui 컴포넌트 활용 (필요시 `npx shadcn@latest add [component]`)
   - 실제 ML 모델 없이도 작동하도록 (시뮬레이션/시각화 중심)

3. **랜딩 페이지 보강** (src/app/page.tsx):
   - 논문 주제에 맞는 히어로 섹션
   - 데모 결과물 프리뷰/스크린샷
   - "How it works" 섹션을 논문 핵심 개념으로 채우기

4. **DB 스키마 확장** (prisma/schema.prisma):
   - 데모에 필요한 모델 추가
   - `npx prisma generate` 실행

5. **SEO 최적화**:
   - docs/SEO_STRATEGY.md 참고하여 메타데이터 최적화
   - 구조화 데이터(JSON-LD) 추가

디자인 원칙:
- shadcn/ui New York 스타일, zinc 베이스
- 여백 충분히, 미니멀하게
- Geist Sans + Geist Mono 폰트
- 모바일 우선 반응형
- 다크모드 + 라이트모드 완벽 지원

가독성 (중요):
- 모든 텍스트가 라이트/다크 양쪽에서 안 보이는 글씨 없이 잘 읽혀야 함
- 하드코딩 색상(white, black 등) 사용 금지 → CSS variable 시맨틱 컬러만 사용
- 차트/시각화도 다크모드에서 선명하게
- 완료 전 라이트/다크 양쪽 모두 확인 필수
