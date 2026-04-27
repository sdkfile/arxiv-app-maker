export const SCORING_PROMPT = `논문 제목: {{title}}
초록: {{abstract}}

이 논문을 간단한 앱(웹/모바일)으로 만들 수 있는지 평가해줘.

평가 항목:
1. 앱 적합성 스코어 (1-10)
2. 추천 앱 형태 (web_demo / mobile_app / cli_tool / api)
3. 앱 아이디어 (1-2문장)
4. 필요한 핵심 기능 (3개 이내, 배열)
5. 예상 구현 난이도 (상/중/하)

스코어링 기준:
- 시각화/인터랙티브 데모 가능성 (높을수록 좋음)
- 입력-출력이 명확한 파이프라인인지
- 일반 사용자가 이해할 수 있는 결과물인지
- 외부 데이터/모델 의존도 (낮을수록 좋음)
- 구현 복잡도 (간단할수록 좋음)

반드시 아래 JSON 형식으로만 응답:
{
  "score": number,
  "recommended_type": "web_demo" | "mobile_app" | "cli_tool" | "api",
  "app_idea": "string",
  "core_features": ["string"],
  "difficulty": "상" | "중" | "하"
}`;

export function buildScoringPrompt(
  title: string,
  abstract: string
): string {
  return SCORING_PROMPT.replace("{{title}}", title).replace(
    "{{abstract}}",
    abstract
  );
}
