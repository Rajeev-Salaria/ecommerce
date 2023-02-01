const express= require('express');
const app = express();
const cors = require('cors')
require('./db/connect')
const router = require('./router/user.routes');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const corsOptions = {
  origin: true,
  methods: ["POST","GET"],
  credentials: true,
  maxAge: 3600
};
app.use(cors(corsOptions))
// =============== user login ======================//
app.use('/api/user',router)

app.get('/',(req,res)=>{
    res.send({message:'sucesss'})
})

app.listen(5000,()=>console.log('http://localhost:5000/api/user/get'))