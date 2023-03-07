import {useEffect} from 'react';
import {axiosPrivate} from '../app/axios';
import {useSelector} from 'react-redux';
import {selectAccessToken} from '../app/auth/authSlice';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {

    const accessToken = useSelector(selectAccessToken);
    const refresh = useRefreshToken();

    useEffect(() => {

        const requestInterceptor = axiosPrivate.interceptors.request.use(req => {
            if(!req.headers['Authorization']) {
                req.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return req;
        }, (error) => Promise.reject(error)
        )

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest.sent) {
                    prevRequest.sent = true; 
                    const accessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    
                    return axiosPrivate({
                        ...prevRequest,
                        headers: {...prevRequest.headers, Authorization: `Bearer ${accessToken}`},
                        sent: true
                    });
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        }

    }, [accessToken, refresh]);


    return axiosPrivate;
}

export default useAxiosPrivate;