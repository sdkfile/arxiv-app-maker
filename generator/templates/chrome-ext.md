논문 정보:
- 제목: {{title}}
- 초록: {{abstract}}
- 카테고리: {{categories}}
- 원문: {{paper_url}}

이 논문의 핵심 아이디어를 Chrome Extension으로 만들어줘.

요구사항:
- Manifest V3
- TypeScript
- 논문 핵심 개념을 활용한 브라우저 확장
- Popup UI (HTML + CSS)
- 필요시 Content Script
- 필요시 Background Service Worker
- 논문 출처 표기 (popup 하단)
- 깔끔한 아이콘 (SVG)

구조:
- manifest.json
- popup/ (HTML, CSS, TS)
- content/ (Content Script, 필요시)
- background/ (Service Worker, 필요시)
- icons/
