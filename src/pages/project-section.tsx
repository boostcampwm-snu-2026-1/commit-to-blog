import { useState } from 'react';
import projectList from '../data/projects.json';
import type { Project } from '../domain/project';

type ProjectWithOriginalIndex = Project & { originalIndex: number };

export const ProjectSection = () => {
  const [currentPage, setCurrentPage] = useState(projectList[0].id);
  const [prevOrder, setPrevOrder] = useState<Record<string, number>>({});

  const currentIndex = projectList.findIndex((p) => p.id === currentPage);
  const sortedProjectList = [
    ...projectList.slice(currentIndex),
    ...projectList.slice(0, currentIndex),
  ].map((project, _, __) => ({
    ...project,
    originalIndex: projectList.findIndex((p) => p.id === project.id),
  }));

  const handleCardTitle = (index: number) => {
    const newCurrentId = sortedProjectList[index].id;
    setPrevOrder(
      Object.fromEntries(sortedProjectList.map((p, i) => [p.id, i]))
    );
    setCurrentPage(newCurrentId);
  };

  return (
    <div className="flex h-full h-screen flex-col gap-8">
      {/* 제목 */}
      <div className="flex items-center gap-6 px-4 py-8">
        <div className="h-7 w-7 rounded-full bg-orange-500"></div>
        <h3 className="font-bold text-2xl">나의 프로젝트를 소개합니다.</h3>
      </div>

      {/* 본문 */}
      <div className="relative w-full flex-1 flex-col overflow-y-hidden border-border-light border-t">
        {sortedProjectList.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            pageIndex={index}
            prevPageIndex={prevOrder[project.id] ?? null}
            handleCardTitle={() => handleCardTitle(index)}
          />
        ))}
      </div>
    </div>
  );
};

const PAGE_STYLES = [
  { width: 'w-[80%]', zIndex: 'z-10' },
  { width: 'w-[90%]', zIndex: 'z-8' },
  { width: 'w-full', zIndex: 'z-6' },
];

const ProjectCard = ({
  project,
  pageIndex,
  prevPageIndex,
  handleCardTitle,
}: {
  project: ProjectWithOriginalIndex;
  pageIndex: number;
  prevPageIndex: number | null;
  handleCardTitle: () => void;
}) => {
  const style = PAGE_STYLES[pageIndex];
  if (!style) {
    return null;
  }

  return (
    <div
      className={`absolute top-0 left-0 flex h-full items-center justify-between border-border-light border-r bg-white ${style.width} ${style.zIndex}`}
    >
      <div className="custom-scrollbar flex h-full w-full flex-1 flex-col overflow-y-scroll p-8">
        <div>{project.title}</div>
      </div>
      <div className="w-fit -rotate-90" onClick={handleCardTitle}>
        Project {project.originalIndex + 1}
      </div>
    </div>
  );
};
