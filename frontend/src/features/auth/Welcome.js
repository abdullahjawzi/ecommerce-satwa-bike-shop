import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';
import moment from 'moment';

import '../../styles/welcome.css';

const Welcome = () => {

    const navigate = useNavigate();

    const {data: {firstName, lastName}} = useSelector(selectAuthUser);

    const [timestamp, setTimestamp] = useState(moment().format('LTS'));

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimestamp(moment().format('LTS'));
        }, 1000)

        return () => clearInterval(timerId);
    }, []);

    return (
        <div>

            <div className="dashboard-welcome-box">
                <h1>Welcome, <span>{`${firstName} ${lastName}`}</span></h1>
                <h6>{moment().format('MMMM Do YYYY')} , {moment().format('dddd')}</h6>
                <p className='welcome-box-current-time'>{timestamp}</p>
                <div className='welcome-box-img'>
                    <img src='/img/welcome.png' alt='welcome' />
                </div>
            </div>

            <div className='dashboard-request-online-service'>
                <button className="btn btn-primary" onClick={() => navigate('/dash/online-service/add')} >Request Online Service</button>
            </div>
            
        </div>
    );
}

export default Welcome;