const express = require('express');
const router = express.Router();


const authControllers = require('../controllers/authControllers');



router.post('/login', authControllers.login);
router.get('/refresh', authControllers.refresh);
router.post('/logout', authControllers.logout);


module.exports = router;