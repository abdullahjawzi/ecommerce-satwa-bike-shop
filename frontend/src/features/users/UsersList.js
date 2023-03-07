import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUsers} from './usersSlice';
import {selectAllUsers, selectUsersStatus, selectUsersError} from './usersSlice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Link} from 'react-router-dom';

const UsersList = () => {

    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();

    
    const users = useSelector(selectAllUsers);
    const usersStatus = useSelector(selectUsersStatus);
    const error = useSelector(selectUsersError);

    useEffect(() => {
        dispatch(fetchUsers(axiosPrivate));
    }, [dispatch, axiosPrivate]);

    let content;

    if(usersStatus === 'idle' || usersStatus === 'loading') {
        content = (<p>Loading...</p>)
    } 

    if(usersStatus === 'success' && error) {
        content = (<p>Error : {error}</p>)
    }

    return (
        content ? content : (
            <>
                <h1>Users List</h1>
                <div>
                    {users.map(user => (
                        <h4 key={user._id}>{user.username}</h4>
                    ))}
                </div>
                <Link to='/login'>Login</Link>
            </>
        )
    );

}


export default UsersList;