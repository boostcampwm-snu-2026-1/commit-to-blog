# 컴포넌트 구조

## 화면 목록
1. 포스트 목록 (Home)
2. 포스트 작성/편집 (Editor + Chat)
3. GitHub 레포 연동

## 디렉터리 구조

```
src/
├── pages/
│   ├── HomePage.tsx           포스트 목록 화면
│   ├── EditorPage.tsx         에디터 + 챗 화면
│   └── RepoConnectPage.tsx    레포 연동 화면
│
└── components/
    ├── layout/
    │   ├── Header.tsx
    │   └── Layout.tsx
    │
    ├── post/
    │   ├── PostList.tsx        목록 컨테이너
    │   └── PostCard.tsx        카드 1개 (제목, 태그, 날짜, 미리보기)
    │
    ├── editor/
    │   ├── MarkdownEditor.tsx  마크다운 에디터
    │   └── EditorToolbar.tsx   툴바 (저장, 발행 등)
    │
    ├── chat/
    │   ├── ChatPanel.tsx       우측 챗 전체 패널
    │   ├── ChatMessage.tsx     메시지 1개 (user / assistant)
    │   └── ChatInput.tsx       입력창
    │
    └── repo/
        ├── RepoSelector.tsx    레포 선택 모달
        ├── RepoCard.tsx        레포 카드 (이름 + README 미리보기)
        └── RepoTag.tsx         포스트에 붙은 레포/브랜치 태그
```

## 화면별 컴포넌트 조합

### HomePage
```
Layout
  Header
  PostList
    PostCard (반복)
```

### EditorPage
```
Layout
  Header
  MarkdownEditor
    EditorToolbar
    RepoTag (포스트에 붙은 태그 목록)
    RepoSelector (모달, 레포 추가 시)
  ChatPanel
    ChatMessage (반복)
    ChatInput
```

### RepoConnectPage
```
Layout
  Header
  RepoCard (반복, GitHub 레포 목록)
```
