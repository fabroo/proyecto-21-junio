const {Router} =require('express');
const router = Router();

const User = require('../models/User');
const Note = require('../models/User');

router.route('/')
.get( async (req,res)  => {


    const users = await User.find()
    
    const notes = await Note.find()
    
    
    res.json(users);
})
.post((req,res) =>{

})

module.exports = router