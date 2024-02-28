import { FC, PropsWithChildren } from 'react'
import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface RequireRoleProps {
    roles: Array<string>,
}

const RequireRole: FC<PropsWithChildren<RequireRoleProps>> = ({children, roles}) => {

    const {isAuth} = useAppSelector(state => state.UserSlice);
    const {user} = useAppSelector(state => state.UserSlice);
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
        if(user.role) {
            if(!roles.includes(user.role)) {
                return <Navigate to="/login" state={{ from: location }} replace />;
            }
        }
    }

    if(location.pathname !== '/profile' && (!user.born || !user.country || !user.name || !user.sname || !user.sex)) {
        return <Navigate to="/profile?req=true" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireRole;