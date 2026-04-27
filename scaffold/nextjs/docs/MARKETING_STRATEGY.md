# 마케팅 전략

## 포지셔닝
"최신 AI 연구를 누구나 체험할 수 있는 인터랙티브 데모"

## 론칭 채널 (우선순위순)

### 1. Reddit / HN (Day 1)
- **r/MachineLearning**: "Show /r/ML" 포맷, 논문 링크 + 데모 링크
- **Hacker News**: "Show HN: [논문 제목] as an interactive web app"
- 핵심: 기술적 깊이 + 간결한 설명

### 2. Twitter/X (Day 1-3)
- 논문 저자 태그 + 데모 GIF/영상
- 스레드: 논문 핵심 3줄 요약 → 데모 링크 → 기술 스택
- 해시태그: #MachineLearning #AI #arXiv #OpenSource

### 3. Product Hunt (Week 1)
- 제목: 한 줄 가치 제안
- 스크린샷 4-5장 (데모 과정)
- Maker comment에 논문 배경 설명

### 4. 논문 커뮤니티 (Week 1-2)
- Papers With Code에 데모 링크 등록
- arXiv 저자에게 이메일 (데모 만들었다고)
- Hugging Face Spaces 크로스 포스팅

## 수익화 경로

### Freemium 모델
| 티어 | 기능 | 가격 |
|------|------|------|
| Free | 기본 데모, 일일 N회 제한 | $0 |
| Pro | 무제한 + API + 고급 옵션 | $9/월 |
| Team | Pro + 팀 공유 + 우선 지원 | $29/월 |

### Polar.sh 연동
- 체크아웃: `/api/checkout` → Polar hosted checkout
- 웹훅: `/api/webhook` → plan 업그레이드 처리
- Product ID는 Polar 대시보드에서 생성

## 성장 전략

### 유기적 성장
1. SEO (논문 키워드 타겟)
2. 논문 나올 때마다 새 앱 = 새 랜딩 페이지 = 롱테일 SEO
3. 각 앱에서 "Powered by [브랜드]" → 메인 사이트로 유입

### 네트워크 효과
- 각 앱이 독립 마케팅 채널 역할
- N개 앱 = N개 검색 진입점
- 시간이 갈수록 도메인 권위 상승

## KPI
- 주간 신규 방문자 수
- Demo 사용률 (방문 → 데모 실행)
- Free → Pro 전환율
- 논문당 평균 트래픽
