import { useLocation } from 'react-router-dom';

export default (url) => new URLSearchParams(url || useLocation().search);
