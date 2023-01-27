const express= require('express');
const app = express();
require('./db/connect')
const router = require('./router/user.routes');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// =============== user login ======================//
app.use('/api/user',router)

app.get('/',(req,res)=>{
    res.send({message:'sucesss'})
})

app.listen(5000,()=>console.log('http://localhost:5000/api/user/get'))