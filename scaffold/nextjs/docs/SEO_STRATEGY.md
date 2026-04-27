# SEO 전략

## 목표
논문 키워드 + 앱 사용사례 기반으로 검색 유입 확보.
"논문 제목 + demo", "논문 주제 + tool", "논문 주제 + online" 패턴 타겟.

## 기본 SEO 체크리스트

### 메타데이터
- [ ] title: 핵심 키워드 포함, 60자 이내
- [ ] description: 가치 제안 + 키워드, 155자 이내
- [ ] og:image: 앱 스크린샷 또는 데모 결과물 이미지
- [ ] canonical URL 설정

### 구조
- [ ] 시맨틱 HTML (h1 하나, h2~h3 구조화)
- [ ] Next.js metadata API 사용 (layout.tsx)
- [ ] sitemap.xml 자동 생성 (next-sitemap)
- [ ] robots.txt

### 콘텐츠
- [ ] 랜딩 페이지에 논문 핵심 개념 자연어 설명
- [ ] "How it works" 섹션으로 사용법 가이드
- [ ] FAQ 섹션 (논문 관련 질문 + 앱 사용법)
- [ ] 논문 인용/출처 명시 (학술 신뢰성)

### 기술
- [ ] Core Web Vitals 최적화 (LCP < 2.5s, CLS < 0.1)
- [ ] Image 최적화 (next/image, WebP)
- [ ] 모바일 반응형
- [ ] HTTPS (Vercel 자동)

## 키워드 전략

### Primary Keywords
- `[논문 주제] demo`
- `[논문 주제] tool online`
- `[논문 주제] app`

### Long-tail Keywords
- `how to [논문이 해결하는 문제]`
- `[논문 주제] visualization`
- `[논문 주제] interactive`

### 콘텐츠 확장 (선택)
- 블로그 포스트: 논문 해설 + 앱 사용 가이드
- 비교 페이지: 기존 도구 vs 이 앱

## 구조화 데이터

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "{{APP_NAME}}",
  "description": "{{APP_DESCRIPTION}}",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```
