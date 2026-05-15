import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/client";
import type { BranchSummary, CommitSummary, RepositorySummary } from "../api/types";
import { useAppShellContext } from "../layouts/AppShell";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function CreateBlogPage() {
  const navigate = useNavigate();
  const { meta } = useAppShellContext();
  const [repositories, setRepositories] = useState<RepositorySummary[]>([]);
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [commits, setCommits] = useState<CommitSummary[]>([]);
  const [selectedRepositoryFullName, setSelectedRepositoryFullName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCommitShas, setSelectedCommitShas] = useState<string[]>([]);
  const [loadingLabel, setLoadingLabel] = useState("저장소를 불러오는 중입니다.");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRepository = useMemo(
    () => repositories.find((repository) => repository.fullName === selectedRepositoryFullName) ?? null,
    [repositories, selectedRepositoryFullName]
  );

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    void api
      .listRepositories()
      .then((nextRepositories) => {
        if (!active) {
          return;
        }

        setRepositories(nextRepositories);

        if (nextRepositories.length > 0) {
          setSelectedRepositoryFullName(nextRepositories[0].fullName);
        }
      })
      .catch((nextError: Error) => {
        if (active) {
          setError(nextError.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedRepository) {
      return;
    }

    let active = true;
    setLoadingLabel("브랜치를 불러오는 중입니다.");
    setIsLoading(true);
    setBranches([]);
    setCommits([]);
    setSelectedCommitShas([]);

    void api
      .listBranches(selectedRepository.owner, selectedRepository.name)
      .then((nextBranches) => {
        if (!active) {
          return;
        }

        setBranches(nextBranches);

        const defaultBranch =
          nextBranches.find((branch) => branch.name === selectedRepository.defaultBranch)?.name ??
          nextBranches[0]?.name ??
          "";

        setSelectedBranch(defaultBranch);
      })
      .catch((nextError: Error) => {
        if (active) {
          setError(nextError.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedRepository]);

  useEffect(() => {
    if (!selectedRepository || !selectedBranch) {
      return;
    }

    let active = true;
    setLoadingLabel("커밋 목록을 불러오는 중입니다.");
    setIsLoading(true);
    setSelectedCommitShas([]);

    void api
      .listCommits(selectedRepository.owner, selectedRepository.name, selectedBranch)
      .then((nextCommits) => {
        if (active) {
          setCommits(nextCommits);
        }
      })
      .catch((nextError: Error) => {
        if (active) {
          setError(nextError.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedBranch, selectedRepository]);

  function toggleCommit(sha: string) {
    setSelectedCommitShas((current) =>
      current.includes(sha) ? current.filter((item) => item !== sha) : [...current, sha]
    );
  }

  async function handleGenerate() {
    if (!selectedRepository || !selectedBranch || selectedCommitShas.length === 0) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const post = await api.generateBlog({
        repositoryOwner: selectedRepository.owner,
        repositoryName: selectedRepository.name,
        branch: selectedBranch,
        commitShas: selectedCommitShas
      });

      navigate(`/posts/${post.id}`);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "초안 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="page-stack">
      <div className="page-hero surface">
        <p className="eyebrow">Create Blog</p>
        <h2>커밋에서 개발 블로그 초안 만들기</h2>
        <p>
          저장소와 브랜치를 고르고 커밋을 여러 개 선택하면, 서버가 GitHub 변경 맥락을 읽고 AI 초안을 생성합니다.
        </p>
        <div className="inline-note">
          {meta?.githubMode === "demo" || meta?.openAIMode === "demo"
            ? "현재 일부 연동이 demo 모드입니다. 토큰이 없더라도 전체 UX 를 검증할 수 있습니다."
            : "GitHub 와 OpenAI 가 live 모드로 연결되어 있습니다."}
        </div>
      </div>

      <div className="form-grid">
        <article className="surface panel">
          <header className="panel__header">
            <div>
              <p className="eyebrow">Step 1</p>
              <h3>분석 대상 선택</h3>
            </div>
            <span className="muted-chip">{selectedCommitShas.length} commits selected</span>
          </header>

          <label className="field">
            <span>Repository</span>
            <select
              value={selectedRepositoryFullName}
              onChange={(event) => setSelectedRepositoryFullName(event.target.value)}
              disabled={repositories.length === 0}
            >
              {repositories.map((repository) => (
                <option key={repository.fullName} value={repository.fullName}>
                  {repository.fullName}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Branch</span>
            <select value={selectedBranch} onChange={(event) => setSelectedBranch(event.target.value)} disabled={branches.length === 0}>
              {branches.map((branch) => (
                <option key={branch.name} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>

          {selectedRepository ? (
            <div className="repository-summary">
              <strong>{selectedRepository.fullName}</strong>
              <p>{selectedRepository.description ?? "설명이 없는 저장소입니다."}</p>
              <small>마지막 업데이트: {formatDate(selectedRepository.updatedAt)}</small>
            </div>
          ) : null}
        </article>

        <article className="surface panel">
          <header className="panel__header">
            <div>
              <p className="eyebrow">Step 2</p>
              <h3>커밋 선택</h3>
            </div>
          </header>

          {isLoading ? <p className="placeholder-text">{loadingLabel}</p> : null}

          {!isLoading && commits.length === 0 ? (
            <p className="placeholder-text">선택 가능한 커밋이 없습니다.</p>
          ) : (
            <div className="commit-list">
              {commits.map((commit) => {
                const isSelected = selectedCommitShas.includes(commit.sha);

                return (
                  <button
                    key={commit.sha}
                    type="button"
                    className={`commit-card${isSelected ? " commit-card--selected" : ""}`}
                    onClick={() => toggleCommit(commit.sha)}
                  >
                    <div className="commit-card__topline">
                      <span className="commit-card__sha">{commit.sha.slice(0, 7)}</span>
                      <span>{formatDate(commit.committedAt)}</span>
                    </div>
                    <strong>{commit.message}</strong>
                    <p>{commit.authorName}</p>
                  </button>
                );
              })}
            </div>
          )}
        </article>
      </div>

      <article className="surface panel panel--accent">
        <header className="panel__header">
          <div>
            <p className="eyebrow">Step 3</p>
            <h3>AI 초안 생성</h3>
          </div>
        </header>

        <p className="panel__body-copy">
          선택된 커밋의 메시지와 diff 일부를 서버에서 정리한 뒤, 마크다운 초안으로 저장합니다. 생성 후 바로 편집 화면으로 이동합니다.
        </p>

        {error ? <p className="error-message">{error}</p> : null}

        <button
          type="button"
          className="primary-button"
          onClick={handleGenerate}
          disabled={!selectedRepository || !selectedBranch || selectedCommitShas.length === 0 || isGenerating}
        >
          {isGenerating ? "초안을 생성하는 중..." : "Create Blog Draft"}
        </button>
      </article>
    </section>
  );
}

