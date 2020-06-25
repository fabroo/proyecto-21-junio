const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')))

app.use(cookieParser());
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/mernauth',{useNewUrlParser : true,useUnifiedTopology: true,useCreateIndex:true},()=>{
    console.log('successfully connected to database');
});

const userRouter = require('./routes/User');
app.use('/user',userRouter);
app.use('/python', require('./routes/python'))
app.use('/todos', require('./routes/todo'))



app.listen(5000,()=>{
    console.log('express server started');
}); 