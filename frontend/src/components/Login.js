import {useState} from 'react';
import {axiosPublic} from '../app/axios';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../app/auth/authSlice';
import {Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';



import {MdKeyboardBackspace} from 'react-icons/md';

import '../styles/login.css';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async e => {
        e.preventDefault();

        if(!username.trim() || !password.trim()) return alert('Both username and password are required');
        
        setLoading(true);
        
        try {
            const response = await axiosPublic.post('/api/auth/login', JSON.stringify({username,password}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response.data);
            dispatch(loginSuccess({accessToken: response.data.accessToken, user: response.data.user}));
            setLoading(false);
            navigate('/dash');

        } catch(err) {
            alert(err.response?.data?.message);
            setLoading(false);
        } 

    }

    return (
        <div className="login w-100 vh-100 d-flex justify-content-center align-items-center">

            <Form onSubmit={handleLoginSubmit} className='login-form'>

                <button type='button' className='btn btn-dark btn-sm mb-4'onClick={() => navigate('/')} ><MdKeyboardBackspace /> Go back to landing page</button>

                <h1 className="login-form-title">Login</h1>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>

                <Button 
                    type='submit' 
                    variant='primary' 
                    className="auth-btn"
                    disabled={loading}
                >
                    {loading 
                        ? (
                            <>
                                {/* <AiOutlineLoading3Quarters /> */}
                                <span>wait...</span>
                            </>
                        )
                        : 'Login'}
                </Button>
            
            </Form>
            
        </div>
    );
}


export default Login;