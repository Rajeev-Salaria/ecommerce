const express = require("express");
const router = express.Router();
const {registerUser,getUsers,login,getCurrentUser} = require('../controller/user.controller');
const auth = require('../middlewares/auth');
router.post('/login', login)
// ================ register route =======================//
router.post('/register', registerUser)

//=========== get route ==========================//
router.get('/get',getUsers)

router.get('/current', auth, getCurrentUser)

module.exports = router;