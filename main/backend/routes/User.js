const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const UserNew = require('../models/User');
const Todo = require('../models/Todo');
const User = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const Path = require('path');


userRouter.get('/tool', async (req, res) => {
    const users = await UserNew.find()
    res.json(users)
})

userRouter.post('/registerNew', (req, res) => {
    const { dni, companyID, role, username } = req.body;
    UserNew.findOne({ dni }, (err, user) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        if (user)
            res.status(400).json({ message: { msgBody: "Username is already taken", msgError: true } });
        else {
            const newUser = new UserNew({ username, dni, companyID, role });
            newUser.save(err => {
                if (err) {
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                    console.log(err)
                    console.log('uwu')
                }
                else
                    res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
            });
        }
    });
});

userRouter.get('/users/:compid', async (req, res) => {
    const id = req.params.compid;
    const users = await UserNew.find({ companyID: id })
    res.json(users)
})
userRouter.get('/delete/:_id', async (req, res) => {
    const id = req.params._id;
    const users = await UserNew.deleteOne({ "_id": id })
    res.json(users)
})

userRouter.get('/getFotos/:dni', async (req, res) => {
    const dni = req.params.dni;
    const users = await UserNew.findOne({ "dni": dni })
    res.json({ cantidad: users.cantidadFotos })
})
userRouter.post('/wipeFotos/:dni', async (req, res) => {
    const dni = req.params.dni;
    const companyid = req.body.companyid
    let path = 'fotitos owo/' +companyid+'/'+dni
    console.log(req.body)
    const deleteFolderRecursive = async function(path) {
        if (fs.existsSync(path)) {
            
          fs.readdirSync(path).forEach((file, index) => {
            
            const curPath = Path.join(path, file);
            
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          await UserNew.findOne({ dni: dni }, function (err, doc) {
            if (err) return false;
    
            doc.cantidadFotos = 0;
            doc.save()
    
        })
          res.json({message:'todo ok', messageError: false})

          fs.rmdirSync(path);
        } else {
            res.json({message:'ENOENT no existe eso', messageError: true})
        }
      };
    deleteFolderRecursive(path);
})

userRouter.post('/addFotos/:dni', async (req, res) => {
    const dni = req.params.dni;
    const users = await UserNew.findOne({ "dni": dni })
    await UserNew.findOne({ dni: dni }, function (err, doc) {
        if (err) return false;

        doc.cantidadFotos += req.body.cantidad;
        doc.save()

    })
    res.json({ message: { msgBody: "todo ok", msgError: false } })

})



const signToken = userID => {
    return JWT.sign({
        iss: "NoobCoder",
        sub: userID
    }, "NoobCoder", { expiresIn: "1h" });
}

userRouter.put('/register', async (req, res) => {
    const { username, password, dni, companyID, mail } = req.body;
    const user_ = await UserNew.find({ companyID: companyID, dni: dni, createdAccount: false })


    if (user_.length !== 0 && user_ !== []) {
        await UserNew.findOne({ dni: dni }, function (err, doc) {
            if (err) return false;
            doc.password = password;
            doc.username = username;
            doc.mail = mail;
            doc.createdAccount = true;
            doc.save()
        })

        res.json({ message: { msgBody: "todo ok", msgError: false } })

    } else {
        res.json({ message: { msgBody: "error", msgError: true } });
    }

});

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username, role, dni, companyID, mail, cantidadFotos } = req.user;
        const token = signToken(_id);

        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: { username, role, dni, companyID, mail, cantidadFotos } });

    }

});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { username: "", role: "", dni: "", companyID: "", mail: "", cantidadFotos: 0 }, success: true });
});

userRouter.post('/upload', async function (req, res) {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const direccion1 = 'fotitos owo/' + req.body.companyID;
            const direccion2 = 'fotitos owo/' + req.body.companyID + '/' + req.body.username;
            var cr = false;
            var cro = false;
            if (!fs.existsSync(direccion1)) {
                fs.mkdir(direccion1, err => {
                    if (err) {
                        console.log(err)
                    }
                })
                cr = true;
            }
            else {
                cr = true;

            }

            if (cr) {
                if (!fs.existsSync(direccion2)) {
                    fs.mkdir(direccion2, err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                    cro = true;
                }
                else {
                    cro = true;
                }
                if (cro) {
                    cb(null, direccion2)
                }
            }

        },
        filename: function (req, file, cb) {
            console.log(req.body.username)
            var extArr = file.originalname;
            let extensiones = ['.jpg', '.jpeg', '.png'];
            var extension = '';
            for (let i = 0; i < extensiones.length; i++) {

                if (extArr.includes(extensiones[i])) {
                    extension = extensiones[i]
                }
            }
            cb(null, req.body.username + '-' + Date.now() + '.' + extension)
        }



    })
    var upload = multer({ storage: storage }).array('file')



    console.log("si.")
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        return res.status(200).send(req.file)

    })
    console.log("sapeee")

});

userRouter.post('/todo', passport.authenticate('jwt', { session: false }), (req, res) => {
    const todo = new Todo(req.body);
    todo.save(err => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            req.user.todos.push(todo);
            req.user.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                else
                    res.status(200).json({ message: { msgBody: "Successfully created todo", msgError: false } });
            });
        }
    })
});

userRouter.get('/todos', passport.authenticate('jwt', { session: false }), (req, res) => {
    UserNew.findById({ _id: req.user._id }).populate('todos').exec((err, document) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            res.status(200).json({ todos: document.todos, authenticated: true });
        }
    });
});

userRouter.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'admin') {
        res.status(200).json({ message: { msgBody: 'You are an admin', msgError: false } });
    }
    else
        res.status(403).json({ message: { msgBody: "You're not an admin,go away", msgError: true } });
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, role, dni, companyID, mail, cantidadFotos } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role, dni, modeloEntrenado: false, companyID, mail, cantidadFotos } });
});





module.exports = userRouter;