const express = require("express");
const router = express.Router();
const {registerUser,getUsers,login,getCurrentUser,getAllUsers,getUserById,updateUserById,deleteUserById} = require('../controller/user.controller');
const auth = require('../middlewares/auth');
router.post('/login', login)
// ================ register route =======================//
router.post('/register', registerUser)

//=========== get route ==========================//
router.get('/get',getUsers)

// current user
router.get('/current', auth, getCurrentUser);

// get all users
router.get('/all', getAllUsers);

// get user by id
router.get('/view/:id', getUserById);

// update user by id
router.post('/update/:id', updateUserById);

// delete user by id
router.delete('/delete/:id', deleteUserById);

module.exports = router;