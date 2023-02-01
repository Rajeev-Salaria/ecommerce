const mongoose = require('mongoose');
try{
mongoose.connect('mongodb://127.0.0.1:27017/User')
console.log('connected')
} catch(error){console.log("Error in connection "+error)};
