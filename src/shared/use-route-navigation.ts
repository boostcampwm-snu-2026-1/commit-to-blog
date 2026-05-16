import { useNavigate } from 'react-router';
import { PATH } from '../entity/path';

export const useRouteNavigation = () => {
  const navigate = useNavigate();

  const { HOME, BLOG, ABOUT } = PATH;

  return {
    toHome: () => {
      navigate(HOME);
    },
    toBlog: () => {
      navigate(BLOG);
    },
    toAbout: () => {
      navigate(ABOUT);
    },
  };
};
