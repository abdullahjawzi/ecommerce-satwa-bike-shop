import {useNavigate} from 'react-router-dom';

import  '../styles/landingPage.css'

const LandingPage = () => {

  const navigate = useNavigate();

  return (

    <div className="landing__main__container">

        <div className="small_Description">
            <p>Get new modern cycle in our store ! </p>
            <h5>get your dream bycicle in lowes price range in the market.</h5>
            <button onClick={() => navigate('/login')}>Login</button>
        </div>

        <div className="cycle__image">
            <img src="cycle1.png" alt="cycle" width="500"/>
        </div>

        <div className="text__container">
            <p>SATWA</p>
        </div>
    </div>
  )

}

export default LandingPage;
