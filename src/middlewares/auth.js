const jwt = require('jsonwebtoken');
const Student = require('../models/students');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let decoded= jwt.verify(token, 'testApplicationforAuth');
        const user = await Student.findOne({ _id: decoded.id });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid Token'
            })
        }
        req.user = user;
        req.token = token;

        next();

    } catch (err) {

        console.log(err)
    }
}

module.exports = auth;