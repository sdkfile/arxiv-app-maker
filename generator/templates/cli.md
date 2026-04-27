논문 정보:
- 제목: {{title}}
- 초록: {{abstract}}
- 카테고리: {{categories}}
- 원문: {{paper_url}}

이 논문의 핵심 아이디어를 CLI 도구로 만들어줘.

요구사항:
- Node.js
- TypeScript
- Commander.js (CLI 프레임워크)
- 명확한 --help 출력
- stdin/stdout 파이프 지원
- 컬러 출력 (chalk)
- 진행률 표시 (ora)
- 논문 출처 표기 (--about 플래그)

구조:
- src/index.ts (진입점)
- src/commands/ (서브커맨드)
- src/lib/ (핵심 로직)
- package.json bin 필드 설정
