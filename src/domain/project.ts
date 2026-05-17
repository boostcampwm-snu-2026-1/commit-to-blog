export type Project = {
  id: string;
  title: string;
  thumbnail: string;
  period: {
    start: string;
    end: string;
  };
  description: string;
  problems: {
    id: string;
    problem: string;
    solve: string;
    prs: {
      label: string;
      url: string;
    }[];
    issues: {
      label: string;
      url: string;
    }[];
  }[];
};
