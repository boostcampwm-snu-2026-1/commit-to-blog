import { GithubSection } from '../feature/github/github-section';
import { ProjectSection } from '../feature/project/project-section';

export const ProjectPage = () => {
  return (
    <main className="flex flex-col pt-header">
      <ProjectSection />
      <GithubSection />
    </main>
  );
};
