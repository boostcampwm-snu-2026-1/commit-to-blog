import type { Project } from '../../domain/project';

const OFFSET_PERCENT = 5;

type ProjectWithOriginalIndex = Project & { originalIndex: number };

const PAGE_STYLES = [
  { left: `${OFFSET_PERCENT * 0}%`, zIndex: 'z-10' },
  { left: `${OFFSET_PERCENT * 1}%`, zIndex: 'z-8' },
  { left: `${OFFSET_PERCENT * 2}%`, zIndex: 'z-6' },
  { left: `${OFFSET_PERCENT * 3}%`, zIndex: 'z-4' },
  { left: `${OFFSET_PERCENT * 4}%`, zIndex: 'z-2' },
  { left: `${OFFSET_PERCENT * 5}%`, zIndex: 'z-0' },
];

export const ProjectCard = ({
  project,
  pageIndex,
  animatingTo,
  handleCardTitle,
}: {
  project: ProjectWithOriginalIndex;
  pageIndex: number;
  animatingTo: number | null;
  handleCardTitle: () => void;
}) => {
  const style = PAGE_STYLES[pageIndex];
  if (!style) {
    return null;
  }

  const getTransform = () => {
    if (animatingTo === null) {
      return 'translateX(0%)';
    }

    if (pageIndex < animatingTo) {
      return 'translateX(-100%)';
    } else {
      const moveLeftPercent = animatingTo * OFFSET_PERCENT;
      return `translateX(calc(-${moveLeftPercent}% * 100 / 90))`;
    }
  };

  const getOpacity = () => {
    if (animatingTo === null) {
      return 1;
    }
    return pageIndex < animatingTo ? 0 : 1;
  };

  return (
    <div
      className={`absolute top-0 h-full w-[45%] ${style.zIndex}`}
      style={{
        left: `calc(${style.left} / 2)`,
        transform: getTransform(),
        opacity: getOpacity(),
        transition:
          animatingTo !== null
            ? 'transform 2s cubic-bezier(0.4,0,0.2,1), opacity 2s ease'
            : 'none',
      }}
    >
      <div
        className={`flex h-full w-full items-center justify-between border-border-light border-r bg-white shadow-[3px_0_10px_rgba(0,0,0,0.07)] ${animatingTo === null ? 'card-shake-hover' : ''}`}
      >
        <div
          className={`flex h-full w-full flex-1 flex-col overflow-y-scroll p-8 ${(animatingTo === null ? pageIndex === 0 : pageIndex === animatingTo) ? 'custom-scrollbar' : 'scrollbar-transparent'}`}
        >
          {/* 프로젝트 헤더 */}
          <div className="mb-8 flex gap-10">
            <div className="h-[154px] w-[227px] shrink-0 overflow-hidden bg-placeholder">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col gap-3.5">
              <p className="font-bold text-lg">{project.title}</p>
              <p className="text-sm">
                {project.period.start} ~ {project.period.end}
              </p>
              <p className="text-sm">{project.description}</p>
            </div>
          </div>

          {/* Problem & Solve */}
          <p className="mb-5 font-bold text-lg">Problem & Solve</p>
          <div className="flex flex-col gap-6">
            {project.problems.map((prob, idx) => (
              <div key={prob.id} className="flex flex-col gap-6">
                <div className="flex items-start gap-6">
                  <div className="flex min-w-0 flex-1 flex-col gap-3.5 text-sm">
                    <div className="flex items-center gap-5">
                      <span className="shrink-0 whitespace-nowrap">
                        Problem {idx + 1}
                      </span>
                      <span className="min-w-0 flex-1">{prob.problem}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="shrink-0 whitespace-nowrap">
                        Solve {idx + 1}
                      </span>
                      <span className="min-w-0 flex-1">{prob.solve}</span>
                    </div>
                    <p className="text-muted text-sm">
                      <span className="underline">관련 PR</span>{' '}
                      {prob.prs.map((pr, i) => (
                        <a
                          key={pr.url}
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ({pr.label}){i < prob.prs.length - 1 ? ', ' : ''}
                        </a>
                      ))}
                      {prob.issues.length > 0 && (
                        <>
                          {', '}
                          <span className="underline">관련 이슈</span>{' '}
                          {prob.issues.map((issue, i) => (
                            <a
                              key={issue.url}
                              href={issue.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ({issue.label})
                              {i < prob.issues.length - 1 ? ', ' : ''}
                            </a>
                          ))}
                        </>
                      )}
                    </p>
                  </div>
                  {idx % 2 === 0 && (
                    <div className="h-[154px] w-[227px] shrink-0 bg-placeholder" />
                  )}
                </div>
                {idx < project.problems.length - 1 && (
                  <div className="border-border-light border-t" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className="w-fit -rotate-90 cursor-pointer"
          onClick={handleCardTitle}
        >
          Project {project.originalIndex + 1}
        </div>
      </div>
    </div>
  );
};
