import { useEffect, useMemo, useState } from "react";
import { BlogEditor } from "../components/BlogEditor";
import { BranchSelector } from "../components/BranchSelector";
import { CommitSelector } from "../components/CommitSelector";
import { RepositorySelector } from "../components/RepositorySelector";
import { ApiError } from "../services/apiClient";
import { fetchBranches, fetchCommits, fetchRepositories } from "../services/githubApi";
import { createDraft } from "../services/llmApi";
import type { EditablePost } from "../types/blog";
import type { Branch, CommitSummary, Repository } from "../types/github";

type RequestKey = "repositories" | "branches" | "commits" | "draft";
type RequestStatus = "idle" | "loading" | "success" | "error";

const emptyPost: EditablePost = {
  title: "",
  summary: "",
  content: "",
};

const formatError = (error: unknown) => {
  if (error instanceof ApiError) {
    return `${error.message} (${error.code})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};

export const CreateBlogPage = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [commits, setCommits] = useState<CommitSummary[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedCommitShas, setSelectedCommitShas] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<EditablePost>(emptyPost);
  const [statuses, setStatuses] = useState<Record<RequestKey, RequestStatus>>({
    repositories: "idle",
    branches: "idle",
    commits: "idle",
    draft: "idle",
  });
  const [errors, setErrors] = useState<Partial<Record<RequestKey, string>>>({});

  const setStatus = (key: RequestKey, status: RequestStatus) => {
    setStatuses((current) => ({ ...current, [key]: status }));
  };

  const setError = (key: RequestKey, message: string | null) => {
    setErrors((current) => {
      const next = { ...current };
      if (message) {
        next[key] = message;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const loadRepositories = async () => {
    setStatus("repositories", "loading");
    setError("repositories", null);

    try {
      const nextRepositories = await fetchRepositories();
      setRepositories(nextRepositories);
      setStatus("repositories", "success");
    } catch (error) {
      setRepositories([]);
      setStatus("repositories", "error");
      setError("repositories", formatError(error));
    }
  };

  const handleSelectRepository = (repository: Repository) => {
    setSelectedRepository(repository);
    setSelectedBranch(null);
    setBranches([]);
    setCommits([]);
    setSelectedCommitShas([]);
    setEditingPost(emptyPost);
  };

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setCommits([]);
    setSelectedCommitShas([]);
    setEditingPost(emptyPost);
  };

  const toggleCommit = (sha: string) => {
    setSelectedCommitShas((current) => (
      current.includes(sha)
        ? current.filter((selectedSha) => selectedSha !== sha)
        : [...current, sha]
    ));
  };

  const handleCreateDraft = async () => {
    if (!selectedRepository || !selectedBranch || selectedCommitShas.length === 0 || statuses.draft === "loading") {
      return;
    }

    setStatus("draft", "loading");
    setError("draft", null);

    try {
      const draft = await createDraft({
        repositoryFullName: selectedRepository.fullName,
        branchName: selectedBranch.name,
        commitShas: selectedCommitShas,
      });
      setEditingPost({
        title: draft.title,
        summary: draft.summary,
        content: draft.content,
      });
      setStatus("draft", "success");
    } catch (error) {
      setStatus("draft", "error");
      setError("draft", formatError(error));
    }
  };

  useEffect(() => {
    void loadRepositories();
  }, []);

  useEffect(() => {
    if (!selectedRepository) {
      return;
    }

    const loadBranches = async () => {
      setStatus("branches", "loading");
      setError("branches", null);

      try {
        const nextBranches = await fetchBranches(selectedRepository.fullName);
        setBranches(nextBranches);
        setStatus("branches", "success");
      } catch (error) {
        setBranches([]);
        setStatus("branches", "error");
        setError("branches", formatError(error));
      }
    };

    void loadBranches();
  }, [selectedRepository]);

  useEffect(() => {
    if (!selectedRepository || !selectedBranch) {
      return;
    }

    const loadCommits = async () => {
      setStatus("commits", "loading");
      setError("commits", null);

      try {
        const nextCommits = await fetchCommits(selectedRepository.fullName, selectedBranch.name);
        setCommits(nextCommits);
        setStatus("commits", "success");
      } catch (error) {
        setCommits([]);
        setStatus("commits", "error");
        setError("commits", formatError(error));
      }
    };

    void loadCommits();
  }, [selectedRepository, selectedBranch]);

  const selectedCommits = useMemo(
    () => commits.filter((commit) => selectedCommitShas.includes(commit.sha)),
    [commits, selectedCommitShas],
  );

  const canGenerate = Boolean(selectedRepository && selectedBranch && selectedCommitShas.length > 0 && statuses.draft !== "loading");
  const isDraftReady = Boolean(editingPost.title || editingPost.summary || editingPost.content);

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">AI-Blog Mission</p>
          <h1>Commit to Blog</h1>
        </div>
        <div className="status-strip">
          <span>Repository</span>
          <span>Branch</span>
          <span>Commit</span>
          <span>Draft</span>
        </div>
      </header>

      <section className="workspace">
        <div className="workflow-column">
          <RepositorySelector
            repositories={repositories}
            selectedRepository={selectedRepository}
            isLoading={statuses.repositories === "loading"}
            errorMessage={errors.repositories ?? null}
            onSelect={handleSelectRepository}
            onRetry={loadRepositories}
          />
          <BranchSelector
            branches={branches}
            selectedBranch={selectedBranch}
            selectedRepository={selectedRepository}
            isLoading={statuses.branches === "loading"}
            errorMessage={errors.branches ?? null}
            onSelect={handleSelectBranch}
          />
          <CommitSelector
            commits={commits}
            selectedBranch={selectedBranch}
            selectedCommitShas={selectedCommitShas}
            isLoading={statuses.commits === "loading"}
            errorMessage={errors.commits ?? null}
            onToggle={toggleCommit}
          />
        </div>

        <div className="draft-column">
          <section className="panel action-panel">
            <div className="section-header">
              <div>
                <p className="section-kicker">Step 4</p>
                <h2>Generate</h2>
              </div>
              <span className="tag">{selectedCommits.length} commits</span>
            </div>

            <div className="selection-summary">
              <p>
                <strong>Repository</strong>
                <span>{selectedRepository?.fullName ?? "선택 안 됨"}</span>
              </p>
              <p>
                <strong>Branch</strong>
                <span>{selectedBranch?.name ?? "선택 안 됨"}</span>
              </p>
              <p>
                <strong>Commits</strong>
                <span>{selectedCommitShas.length > 0 ? selectedCommitShas.map((sha) => sha.slice(0, 7)).join(", ") : "선택 안 됨"}</span>
              </p>
            </div>

            {errors.draft && <p className="error-text">{errors.draft}</p>}

            <button className="primary-button" type="button" disabled={!canGenerate} onClick={handleCreateDraft}>
              {statuses.draft === "loading" ? "초안 생성 중" : "AI 초안 생성"}
            </button>
          </section>

          <BlogEditor post={editingPost} isDraftReady={isDraftReady} onChange={setEditingPost} />
        </div>
      </section>
    </main>
  );
};
