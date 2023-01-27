const express = require("express");
const router = express.Router();
const {registerUser,getUsers,login} = require('../controller/user.controller');
router.post('/login', login)
// ================ register route =======================//
router.post('/register', registerUser)

//=========== get route ==========================//
router.get('/get',getUsers)


module.exports = router;