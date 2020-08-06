const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dnname = 'test'
const uri = `mongodb+srv://root:rootroot@test.0vjrm.mongodb.net/${dnname}?retryWrites=true&w=majority`
app.use(express.static(path.join(__dirname, 'client/build')))

app.use(cookieParser());
app.use(express.json());
app.use(cors());
//'mongodb://localhost:27017/mernauth'
mongoose.connect(uri,{useNewUrlParser : true,useUnifiedTopology: true,useCreateIndex:true},()=>{
    console.log('successfully connected to database');
});

const userRouter = require('./routes/User');
app.use('/user',userRouter);
app.use('/python', require('./routes/python'))



app.listen(5000,()=>{
    console.log('express server started');
}); 