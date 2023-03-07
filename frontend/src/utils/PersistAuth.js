import {useEffect, useState} from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAccessToken, selectAuthUser} from '../app/auth/authSlice';

const PersistAuth = () => {

    const accessToken = useSelector(selectAccessToken);
    const authUser = useSelector(selectAuthUser);

    const refresh = useRefreshToken();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAuth = async () => {
            
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally { 
                setLoading(false);
            }
        }

        !accessToken && !authUser && getAuth();

        accessToken && authUser && setLoading(false);

    }, [accessToken, authUser, refresh]);

    return (
        loading
            ? (<p>Loading...</p>)
            : (<Outlet />)
    );

}

export default PersistAuth;