const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.LOCAL_HOST_PORT || 3000;

mongoose.connect(process.env.MONGO_DB_KEY)
.then(()=>console.log('DB Connected'))
.catch(()=>console.error('DB Not Connected'))

app.use('/auth/v1',require('./Auth/auth'));
app.use('/api/v1',require('./Api/api'));

app.listen(port,()=>{
    console.log(`server running at ${port}`);   
})





