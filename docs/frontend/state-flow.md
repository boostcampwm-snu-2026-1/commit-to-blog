# 상태 흐름

## 전역 상태 구조

### postState
```ts
{
  title: string
  content: string        // 에디터 마크다운 내용
}
```

### chatState
```ts
{
  messages: Message[]
  isStreaming: boolean
  pendingEdit: string | null   // 에이전트 수정 제안 (적용 대기)
}
```

### repoContextState
```ts
{
  selectedRepos: Repo[]  // 현재 세션에서 참조 중인 레포 목록
}
```

## 핵심 흐름

### 1. 레포 선택
```
RepoSelector에서 레포 선택
  → repoContextState.selectedRepos에 추가
  → 다음 챗 메시지부터 에이전트가 해당 레포 파일 탐색 가능
```

### 2. 챗 전송
```
ChatInput → 메시지 전송
  → payload: { message, content, selectedRepos }
  → 에이전트: 현재 content + selectedRepos 파일 탐색
  → 스트리밍 응답 → chatState.messages에 추가
```

### 3. 수정 제안 적용
```
에이전트 응답에 수정안 포함
  → chatState.pendingEdit에 저장
  → ChatMessage에 "적용" 버튼 표시
  → 클릭 시 postState.content 업데이트
  → pendingEdit 초기화
```

### 4. 직접 편집
```
MarkdownEditor 입력
  → postState.content 직접 업데이트
  → 다음 챗 전송 시 업데이트된 content 전달
```

## 데이터 흐름 다이어그램

```
RepoSelector ──→ repoContextState
                      │
ChatInput ──→ [message + content + selectedRepos]
                      │
                 FastAPI /chat
                      │
               LangGraph Agent
               ├── read postState.content
               └── tools(selectedRepos 파일 탐색)
                      │
               스트리밍 응답
               ├── 일반 답변 → chatState.messages
               └── 수정 제안 → chatState.pendingEdit
                                    │
                              "적용" 버튼 클릭
                                    │
                           postState.content 업데이트
```
