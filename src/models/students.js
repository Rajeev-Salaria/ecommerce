const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.'],
        lowercase: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        lowercase: true
    },
    city: {
        type: String,
        required: [true, 'City is required.'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        lowercase: true,
        unique: true,
        validate: {
            validator: (content) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(content),
            message: 'Email is not valid!'
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        min: [6,'To short!'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm password is required.'],
        min: [6,'To short!'],
            // validator: (content) => /(?=(.*[A-Z]{1}))(?=(.*[a-z]{1}))((?=(.*[0-9]{1})))((?=(.*[@!^&*+\-()]{1})))(?=.*[a-zA-Z0-9@!^&*+\-()]).{6,15}/.test(content),
            // message: 'Password must contains [A-z,0-9,@!^&*+\-()]',
            // validator:(content)=> content.length > 5 && content.length < 15,
            // message: 'Password length must [6-15]'
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} is not supported'
        },
        lowercase: true
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /[0-9]/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//#region genrate token
studentSchema.methods.genrateToken = async function () {
    try {
        let token = jwt.sign({ id: this._id }, 'testApplicationforAuth');
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token
    } catch (e) {
        console.log('Getting error while genrating token ' + e)
    }
}

//#endregion 

//#region hash passwor before save 
studentSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.hash(user.password, 10).then(function (hash) {
        // override the cleartext password with the hashed one
        user.password = hash;
        user.confirmPassword = user.password;
        next();
    }).catch(e => next(e));
});
// #endregion

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;