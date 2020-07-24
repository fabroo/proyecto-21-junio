var express = require('express');
var app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dedicada',{useNewUrlParser : true,useUnifiedTopology: true,useCreateIndex:true},()=>{
    console.log('successfully connected to database');
});
const port = 5500;

app.use(express.json());
const userRouter = require('./routes/User');

app.use('/user',userRouter);

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port, function () {
    console.log(`app listening on port ${port}`);
})