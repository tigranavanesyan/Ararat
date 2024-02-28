import { FC, PropsWithChildren } from 'react'
import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const OnlyUnauthorized: FC<PropsWithChildren> = ({children}) => {

    const {isAuth} = useAppSelector(state => state.UserSlice);
    const location = useLocation();

    if (isAuth) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default OnlyUnauthorized;