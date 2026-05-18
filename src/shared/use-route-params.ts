import { useLocation } from 'react-router';

export const useRoutePath = () => {
  const location = useLocation();
  return location.pathname;
};
