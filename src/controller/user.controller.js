const Student = require('../models/students');
const bcrypt = require('bcrypt');

// ===================== user controller ==============================//
const registerUser = async (req, res) => {
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    try {
        let user = await Student.findOne({ email: req.body.email });
        if (!user) {
            if (password == confirmPassword) {
                let newUser = new Student(req.body);
                let token = await newUser.genrateToken();
                await newUser.save();
                res.cookies(token).status(201).json({ success: true, message: 'User created successfully.', token: token })
            } else {
                res.status(400).json({ success: false, message: "Password and confirm password are not matched!" })
            }
        } else {
            res.status(401).json({ success: false, message: "User with this email already exist." })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ success: false, message: e })
    }
}

// ==================== login user ==================//
const login = async (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    try {
        let user = await Student.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid login detail." });
        }
        let isPasswordMatched = await bcrypt.compare(password, user.password)
        if (isPasswordMatched) {
            let token = await user.genrateToken();
            res.cookie('loginToken', token).status(200).json({ success: true, message: 'Login sucessfully.', token: token })
        } else {
            res.status(401).json({ sucess: false, message: 'Invalid login detail.' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ sucess: false, message: e })
    }
}

// ================== get All User ==================//
const getUsers = async (req, res) => {
    try {
        let user = await Student.find();
        res.json(user)
    } catch (e) {
        res.status(500).json({ success: false, message: e })
    }
}

// ================== get Current User ==================//
const getCurrentUser = async (req, res) => {
    try {
        let user = req.user;
        console.log(user);
        res.json(user)
    } catch (e) {
        res.status(500).json({ success: false, message: e })
    }
}

//================ get All Users =================//
const getAllUsers = async (req, res) => {
    let limit = req.query.max ? req.query.max : 10;
    let skip = req.query.skip ? req.query.skip : 0;
    let keyword = req.query.keyword ? req.query.keyword.toLowerCase() : false;
    let filterBy = req.query.filterBy ? req.query.filterBy.toLowerCase() : false;
    let data, count;
    try {
        if ((!keyword) && (!filterBy)) {
            data = await Student.find({}, { 'password': 0, 'confirmPassword': 0, 'tokens': 0 }).limit(limit).skip(skip);
            count = await Student.find({}).count();
            res.send({ data, count })
        } else if ((keyword) && (filterBy)) {
            data = await Student.find({
                $and: [{
                    $or:
                        [{ email: { $regex: keyword } }, { city: { $regex: keyword } }, { firstName: { $regex: keyword } }, { lastName: { $regex: keyword } }]
                },
                { $and: [{ gender: filterBy }] }
                ]
            }, { 'password': 0, 'confirmPassword': 0, 'tokens': 0 }).limit(limit).skip(skip);
            count = await Student.find({
                $and: [{
                    $or:
                        [{ email: { $regex: keyword } }, { city: { $regex: keyword } }, { firstName: { $regex: keyword } }, { lastName: { $regex: keyword } }]
                },
                { $and: [{ gender: filterBy }] }
                ]
            }).count();
            res.send({ data, count });
        } else {
            data = await Student.find({ $or: [{ gender: filterBy }, { email: { $regex: keyword } }, { city: { $regex: keyword } }, { firstName: { $regex: keyword } }, { lastName: { $regex: keyword } }] }, { 'password': 0, 'confirmPassword': 0, 'tokens': 0 }).limit(limit).skip(skip);
            count = await Student.find({ $or: [{ gender: filterBy }, { email: { $regex: keyword } }, { city: { $regex: keyword } }, { firstName: { $regex: keyword } }, { lastName: { $regex: keyword } }] }).count();
            res.send({ data, count });
        }
    } catch (e) { res.status(500).json({ error: e, success: false }) }
}


// get user by id 
const getUserById =async (req, res) => {
    try {
        let user = await Student.findById(req.params.id, { 'password': 0, 'confirmPassword': 0, 'tokens': 0 });
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json({ error: err.message, success: false })
    }
}

// eidtUser By Id 
const updateUserById =  async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: 'Successfully updated.', success: true })
    } catch (err) {
        res.status(400).json({ error: err.message, success: false })
    }
}

const deleteUserById = async (req, res) => {
    try {
        let user = await Student.findByIdAndDelete(req.params.id, { 'password': 0, 'confirmPassword': 0, 'tokens': 0 });
        res.status(200).json({ message: 'Deleted successfully.', success: true })
    } catch (err) {
        res.status(400).json({ error: err.message, success: false })
    }
}

module.exports = { registerUser, getUsers, login, getCurrentUser,getAllUsers,getUserById, updateUserById, deleteUserById }