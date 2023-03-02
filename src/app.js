const express= require('express');
const app = express();
const cors = require('cors');
require('./db/connect');
const router = require('./router/user.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use('/webjar', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

app.get('/',async(req,res)=>{
    res.send()
})

app.listen(5000,()=>console.log('http://localhost:5000/api/user/get'))