import { useLocation, useParams } from 'react-router-dom';

export const useBasePath = () => {
    const location = useLocation();
    const params = useParams<Record<string, string>>();

    return Object.values(params).reduce(
        (path: string, param) => path.replace(`/${String(param)}`, ''),
        location.pathname,
    );
};