import {Outlet, Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAccessToken, selectAuthUser} from '../app/auth/authSlice';

const RequireAuth = ({allowedRoles}) => {

    const location = useLocation();

    const accessToken = useSelector(selectAccessToken);
    const authUser = useSelector(selectAuthUser);

    return (
        accessToken && authUser && authUser?.roles.find(role => allowedRoles.includes(role))
            ? (<Outlet />) 
            : accessToken && authUser 
            ? (<Navigate to='/dash' />) // navigate the user to unauthorized page
            : (<Navigate to='/login' state={{from: location}} replace />)
    );

}

export default RequireAuth;