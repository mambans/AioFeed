import { useLocation } from 'react-router-dom';

const useQuery = (url) => {
  const location = useLocation().search;
  return new URLSearchParams(url || location);
};
export default useQuery;
