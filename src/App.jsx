import { useMemo, useState } from "react";
import { BookOpen, FilePlus2, Github, Settings } from "lucide-react";
import BlogEditor from "./components/BlogEditor.jsx";
import BranchSelector from "./components/BranchSelector.jsx";
import CommitList from "./components/CommitList.jsx";
import RepositorySelector from "./components/RepositorySelector.jsx";
import SavedPostCard from "./components/SavedPostCard.jsx";
import { branches, commits, repositories, savedPosts as initialPosts } from "./data/mockData.js";

const draftTemplate = `# Fix user login bug

## 작업 배경
로그인 과정에서 일부 사용자가 세션을 정상적으로 유지하지 못하는 문제가 있었습니다.

## 변경 내용
- 로그인 API 응답 처리 흐름을 정리했습니다.
- 세션 만료 상태에서 보여줄 예외 메시지를 보완했습니다.
- README에 실행 방법을 추가했습니다.

## 배운 점
커밋을 글감으로 바꾸려면 변경 내용뿐 아니라 왜 바꿨는지 함께 정리하는 과정이 중요했습니다.`;

function App() {
  const [activePage, setActivePage] = useState("create");
  const [selectedRepositoryId, setSelectedRepositoryId] = useState(repositories[0].id);
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [selectedCommitIds, setSelectedCommitIds] = useState([commits[0].sha]);
  const [draft, setDraft] = useState(draftTemplate);
  const [posts, setPosts] = useState(initialPosts);

  const selectedRepository = repositories.find((repository) => repository.id === selectedRepositoryId);
  const branchOptions = branches[selectedRepository.fullName] ?? [];
  const visibleCommits = commits.filter((commit) => commit.branch === selectedBranch);
  const selectedCommits = useMemo(
    () => commits.filter((commit) => selectedCommitIds.includes(commit.sha)),
    [selectedCommitIds],
  );

  function changeRepository(repositoryId) {
    const nextRepository = repositories.find((repository) => repository.id === repositoryId);
    const nextBranch = branches[nextRepository.fullName][0].name;

    setSelectedRepositoryId(repositoryId);
    setSelectedBranch(nextBranch);
    setSelectedCommitIds([]);
  }

  function changeBranch(branchName) {
    setSelectedBranch(branchName);
    setSelectedCommitIds([]);
  }

  function toggleCommit(sha) {
    setSelectedCommitIds((current) =>
      current.includes(sha) ? current.filter((commitSha) => commitSha !== sha) : [...current, sha],
    );
  }

  function generateDraft() {
    const title = selectedCommits[0]?.message ?? "새 개발 블로그 초안";
    const commitSummary = selectedCommits.map((commit) => `- ${commit.message}`).join("\n");

    setDraft(`# ${title}

## 작업 배경
${selectedRepository.name} 저장소의 ${selectedBranch} 브랜치에서 선택한 커밋을 바탕으로 개발 과정을 정리합니다.

## 선택한 커밋
${commitSummary || "- 아직 선택한 커밋이 없습니다."}

## AI 요약 초안
이번 변경은 코드 안정성과 개발 경험을 개선하기 위한 작업입니다. 커밋 메시지를 기준으로 주요 변경 사항을 묶고, 문제 상황과 해결 과정을 블로그 글 형태로 정리했습니다.

## 다음에 보완할 점
실제 GitHub diff와 LLM API를 연결하면 더 구체적인 기술 설명을 생성할 수 있습니다.`);
  }

  function saveDraft() {
    const firstCommit = selectedCommits[0];
    const title = draft.split("\n")[0].replace("#", "").trim() || "Untitled Post";
    const nextPost = {
      id: `post-${Date.now()}`,
      title,
      branch: selectedBranch,
      summary: draft.replaceAll("#", "").split("\n").filter(Boolean).slice(1, 3).join(" "),
      content: draft,
      createdAt: new Date().toISOString().slice(0, 10),
      status: "draft",
      commitSha: firstCommit?.sha ?? "mock",
    };

    setPosts((current) => [nextPost, ...current]);
    setActivePage("saved");
  }

  function editPost(post) {
    setDraft(post.content);
    setSelectedBranch(post.branch);
    setActivePage("create");
  }

  function publishPost(postId) {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, status: "published" } : post)),
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Github size={22} aria-hidden="true" />
          <strong>Commit to Blog</strong>
        </div>
        <nav className="nav-tabs" aria-label="주요 메뉴">
          <button className={activePage === "create" ? "active" : ""} onClick={() => setActivePage("create")}>
            <FilePlus2 size={15} aria-hidden="true" />
            My Blog
          </button>
          <button className={activePage === "saved" ? "active" : ""} onClick={() => setActivePage("saved")}>
            <BookOpen size={15} aria-hidden="true" />
            Saved Posts
          </button>
          <button type="button">
            <Settings size={15} aria-hidden="true" />
            Settings
          </button>
        </nav>
      </header>

      {activePage === "create" ? (
        <main className="create-layout">
          <section className="control-panel" aria-label="커밋 선택">
            <RepositorySelector
              repositories={repositories}
              selectedRepositoryId={selectedRepositoryId}
              onChange={changeRepository}
            />
            <BranchSelector branches={branchOptions} selectedBranch={selectedBranch} onChange={changeBranch} />
            <CommitList
              commits={visibleCommits}
              selectedCommitIds={selectedCommitIds}
              onToggleCommit={toggleCommit}
              onGenerateDraft={generateDraft}
            />
          </section>

          <BlogEditor
            draft={draft}
            repository={selectedRepository}
            selectedBranch={selectedBranch}
            selectedCommits={selectedCommits}
            onChange={setDraft}
            onGenerateDraft={generateDraft}
            onSave={saveDraft}
          />
        </main>
      ) : (
        <main className="saved-page">
          <div className="section-heading">
            <div>
              <p>저장된 포스트</p>
              <h1>Saved Posts</h1>
            </div>
            <button className="primary-button" onClick={() => setActivePage("create")}>
              <FilePlus2 size={16} aria-hidden="true" />
              새 포스트 생성
            </button>
          </div>
          <section className="post-grid" aria-label="저장된 포스트 목록">
            {posts.map((post) => (
              <SavedPostCard key={post.id} post={post} onEdit={editPost} onPublish={publishPost} />
            ))}
            <button className="new-post-card" onClick={() => setActivePage("create")}>
              <FilePlus2 size={28} aria-hidden="true" />
              새 포스트 작성
            </button>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
