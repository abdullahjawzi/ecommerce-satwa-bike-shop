const express = require('express');
const router = express.Router();

const {auth} = require('../middleware/auth');

const profileControllers = require('../controllers/profileControllers');

router.use(auth);

router.route('/')
    .put(profileControllers.updateProfile) 
    .get(profileControllers.getProfile); 


module.exports = router;