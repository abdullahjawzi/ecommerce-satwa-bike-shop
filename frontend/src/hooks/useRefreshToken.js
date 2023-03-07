import {axiosPublic} from '../app/axios';
import {useDispatch} from 'react-redux';
import {loginSuccess, logoutAuthUser} from '../app/auth/authSlice';

const useRefreshToken = () => {

    const dispatch = useDispatch();

    const refresh = async () => {
        try {
            const response = await axiosPublic.get('/api/auth/refresh');
        
            dispatch(loginSuccess({accessToken: response.data.accessToken, user: response.data.user}));
            return response.data.accessToken;
        } catch(err) {
            if(err.response.status === 403) {
                
                dispatch(logoutAuthUser());
            }
        }
        
    }

    return refresh;
}

export default useRefreshToken;