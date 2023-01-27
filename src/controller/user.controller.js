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
                console.log(token, 'is')
                await newUser.save();
            } else {
                res.status(400).json({ success: false, message: "Password and confirm password are not matched!" })
            }
        } else {
            res.status(401).json({ success: false, message: "User with this email already exist." })
        }
        res.status(201).json({ success: true, message: 'User created successfully.' })
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: e })
    }
}

// ==================== login user ==================//
const login = async (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    try {
        let user = await Student.findOne({email});
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid login detail." });
        }
        let isPasswordMatched = await bcrypt.compare(password, user.password)
        if (isPasswordMatched) {
            let token= await user.genrateToken();
            res.cookies(token).status(200).json({ success: true, message: 'Login sucessfully.' })
        } else {
            res.status(401).json({ sucess: false, message: 'Invalid login detail.' })
        }
    } catch (e) {
      res.status(501).json({ sucess: false, message: e })
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

module.exports = { registerUser, getUsers, login }