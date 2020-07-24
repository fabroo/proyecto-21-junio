const express = require('express');
const userRouter = express.Router();
const UserNew = require('../models/User');
const passport = require('passport');
const passportConfig = require('../passport');
const bcrypt = require('bcrypt')

userRouter.get('/tool', async (req, res) => {
    const usuarios = await UserNew.find()
    return res.json({ message: usuarios });
})
userRouter.get('/bye', async (req, res) => {
    await UserNew.deleteMany()
    return res.json({ message: 'chau' });
})

userRouter.post('/update', async (req, res) => {
    await UserNew.deleteMany()
    const usuarios = req.body;
    usuarios.forEach(async usuario => {
        const { dni, password, _id, companyid } = usuario
        const newUser = await new UserNew({ _id, dni, password, companyid })
        await newUser.save()
    })

    return res.json({ message: 'done' })
})

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const {  _id,dni, companyID } = req.user;
        return res.json({ isAuthenticated: true, user: {_id, dni, companyID } });
    }

});

// userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
//     const {  _id,dni, companyID } = req.user;
//     res.json({ isAuthenticated: true, user: {_id,dni, companyID } });
// });


module.exports = userRouter;
