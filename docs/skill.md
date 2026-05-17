# AI Interview Skill Spec

## 목적
GitHub commit diff를 기반으로, 주니어 개발자에게 학습가치 높은 디펜스 질문을 생성하고 답변/힌트/해설 과정을 구조화하여 블로그 초안 생성에 활용한다.

## 입력
- `repoFullName: string`
- `commitSha: string`
- `diff: string`
- `question?: string`
- `expectedAnswer?: string`
- `userAnswer?: string`
- `mode?: "success" | "unknown" | "skip"`
- `turnHistory?: InterviewTurn[]`

## 출력 JSON 스키마

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "InterviewLLMOutput",
  "type": "object",
  "required": ["type", "payload"],
  "properties": {
    "type": {
      "type": "string",
      "enum": ["question_set", "answer_feedback", "hint", "explanation", "draft"]
    },
    "payload": {
      "oneOf": [
        {
          "type": "object",
          "required": ["questions"],
          "properties": {
            "questions": {
              "type": "array",
              "minItems": 1,
              "maxItems": 2,
              "items": {
                "type": "object",
                "required": ["question", "expectedAnswer", "hint", "conceptTags"],
                "properties": {
                  "question": { "type": "string", "minLength": 10 },
                  "expectedAnswer": { "type": "string", "minLength": 20 },
                  "hint": { "type": "string", "minLength": 10 },
                  "conceptTags": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 5,
                    "items": { "type": "string" }
                  }
                }
              }
            }
          }
        },
        {
          "type": "object",
          "required": ["result", "feedback", "expectedAnswer"],
          "properties": {
            "result": { "type": "string", "enum": ["pass", "partial", "fail"] },
            "feedback": { "type": "string", "minLength": 20 },
            "expectedAnswer": { "type": "string", "minLength": 20 }
          }
        },
        {
          "type": "object",
          "required": ["hint"],
          "properties": { "hint": { "type": "string", "minLength": 10 } }
        },
        {
          "type": "object",
          "required": ["explanation", "keyTakeaways"],
          "properties": {
            "explanation": { "type": "string", "minLength": 30 },
            "keyTakeaways": {
              "type": "array",
              "minItems": 2,
              "maxItems": 5,
              "items": { "type": "string" }
            }
          }
        },
        {
          "type": "object",
          "required": ["title", "draftMarkdown", "summary"],
          "properties": {
            "title": { "type": "string", "minLength": 5 },
            "draftMarkdown": { "type": "string", "minLength": 50 },
            "summary": { "type": "string", "minLength": 10 }
          }
        }
      ]
    }
  }
}
```

## 평가 기준
- 정확성: diff 근거와 일치하는가
- 난이도: 주니어 기준으로 어렵지만 설명 가능한 수준인가
- 학습가치: 구현 의도/대안/트레이드오프를 학습하게 만드는가

## 금지사항
- diff 근거 없는 추측/단정
- 민감정보(토큰/키/개인정보) 유도 또는 노출
- 조롱/비난 등 비건설적 피드백
- JSON 스키마 위반 출력
