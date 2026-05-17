import { useRef, useState } from 'react';
import projectList from '../../data/projects.json';
import { ProjectCard } from './project-card';

const ANIMATION_DURATION = 2000;
const VISIBLE_COUNT = 3;

export const ProjectSection = () => {
  const [currentPage, setCurrentPage] = useState(projectList[0].id);
  const [animatingTo, setAnimatingTo] = useState<number | null>(null);
  const isAnimating = useRef(false);

  const currentIndex = projectList.findIndex((p) => p.id === currentPage);
  const sortedProjectList = [
    ...projectList.slice(currentIndex),
    ...projectList.slice(0, currentIndex),
  ].map((project, _, __) => ({
    ...project,
    originalIndex: projectList.findIndex((p) => p.id === project.id),
  }));

  const doubledProjectList = [...sortedProjectList, ...sortedProjectList];

  const handleCardTitle = (clickedVisualIndex: number, clickedId: string) => {
    if (isAnimating.current || clickedVisualIndex === 0) {
      return;
    }
    if (clickedVisualIndex > VISIBLE_COUNT) {
      return;
    }
    isAnimating.current = true;
    setAnimatingTo(clickedVisualIndex);
    setTimeout(() => {
      isAnimating.current = false;
      setAnimatingTo(null);
      setCurrentPage(clickedId);
    }, ANIMATION_DURATION);
  };

  return (
    <div className="flex h-full h-screen flex-col gap-8">
      {/* 제목 */}
      <div className="flex items-center gap-6 px-12 py-8">
        <div className="h-7 w-7 rounded-full bg-orange-500"></div>
        <h3 className="font-bold text-2xl">나의 프로젝트를 소개합니다.</h3>
      </div>

      {/* 본문 */}
      <div className="relative w-full flex-1 flex-col overflow-x-hidden overflow-y-hidden border-border-light border-t">
        <div className={`relative flex h-full w-[200%]`}>
          {doubledProjectList.map((project, index) => {
            return (
              <ProjectCard
                key={`${project.id}-${Math.floor(index / sortedProjectList.length)}`}
                project={project}
                pageIndex={index}
                animatingTo={animatingTo}
                handleCardTitle={() => handleCardTitle(index, project.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
