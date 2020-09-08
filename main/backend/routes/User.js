const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const UserNew = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const Path = require('path');
const zip = require('express-zip');
const AWSManager = require('../aws');
const { spawn } = require('child_process');



userRouter.get('/tool', async (req, res) => {
    const users = await UserNew.find()
    return res.json(users)
})

userRouter.get('/hola', async (req, res) => {
    return res.send('hola mundooo')
})
userRouter.get('/mod', async (req, res) => {
    const users = await UserNew.find()
    return res.json(users)


})
userRouter.get('/pfp/:companyid/:dni', async (req, res) => {
    var companyid = req.params.companyid;
    var dni = req.params.dni;

    try {
        fs.access(`.\\users\\${companyid}\\${dni}\\${dni}.png`, fs.F_OK, (err) => {
            return res.sendFile(`\\users\\${companyid}\\${dni}\\${dni}.png`, { root: '.' })
        })
    }
    catch{
        fs.access(`.\\users\\${companyid}\\${dni}.jpg`, fs.F_OK, (err) => {
            return res.sendFile(`\\users\\${companyid}\\${dni}.jpg`, { root: '.' })
        })
    }


})

userRouter.post('/registerNew', (req, res) => {
    const { dni, companyID, role, username } = req.body;
    UserNew.findOne({ dni }, (err, user) => {
        if (err)
            return res.json({ message: { msgBody: "Error has occured", msgError: true } });
        if (user)
            return res.json({ message: { msgBody: "Username is already taken", msgError: true } });
        else {
            const newUser = new UserNew({ username, dni, companyID, role });
            newUser.save(err => {
                if (err) {
                    return res.json({ message: { msgBody: "Error has occured", msgError: true } });
                }
                else
                    return res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
            });
        }
    });
});

userRouter.get('/users/:compid', async (req, res) => {
    const id = req.params.compid;
    const users = await UserNew.find({ companyID: id })
    return res.json(users)
})
userRouter.get('/delete/:_id', async (req, res) => {
    const id = req.params._id;
    const user = await UserNew.findOne({ "_id": id })
    const users = await UserNew.deleteOne({ "_id": id })
    var dni = user.dni;
    var company = user.companyID;
    // const python = spawn('python', ['delete.py', dni, company])
    // var largeDataSet = []
    // await python.stdout.on('data', async (data) => {
    //     largeDataSet.push(data);
    //     var dataaaa = largeDataSet.join("")
    // });
    // return res.json(users)
})

userRouter.get('/getFotos/:dni', async (req, res) => {
    const dni = req.params.dni;
    const users = await UserNew.findOne({ "dni": dni })
    return res.json({ cantidad: users.cantidadFotos })
})
userRouter.get('/download/:companyid', async (req, res) => {
    const companyid = req.params.companyid
    var lionelmessi = [
        { path: './pickles/' + companyid + '/known_names', name: 'known_names' },
        { path: './pickles/' + companyid + '/known_faces', name: 'known_faces' }]
    return res.zip(lionelmessi);

})

userRouter.get('/get_data/:companyid', async (req, res) => {
    let companyid = req.params.companyid
    var largeDataSet = [];

    // const python = spawn('python', ['pickle_to_text_faces.py', companyid]);
    // console.log('afuera')

    // await python.stdout.on('data', async (data) => {
    //     console.log('adentro faces')
    //     largeDataSet.push(data);

    // });
    // await python.stdout.on('close', async code => {
    //     let rawData = largeDataSet.join("")
    //     let edited = rawData.slice(1, rawData.length - 3)
    //     let porArray = edited.split('array')
    //     let arrayDeEncodingss = []

    //     porArray.forEach(encoding => {
    //         if (encoding.length > 0) {
    //             arrayDeEncodingss.push(encoding.trim())
    //         }
    //     })
    //     let encoding_bien_format = []
    //     arrayDeEncodingss.forEach(arraydeencoding => {
    //         if (arraydeencoding[arraydeencoding.length - 1] == ',') {
    //             let uwu = arraydeencoding.slice(1, arraydeencoding.length - 2)

    //             encoding_bien_format.push(uwu.slice(2, uwu.length - 2))
    //         } else {
    //             encoding_bien_format.push(arraydeencoding.slice(2, arraydeencoding.length - 2))

    //         }
    //     })
    //     let encodings_correctos = []
    //     encoding_bien_format.forEach(encoding => {
    //         let elArray = []
    //         let numeros = encoding.split(',')
    //         numeros.forEach(numero => {
    //             elArray.push(parseFloat(numero.replace('\r\n', '').trim()))

    //         })
    //         encodings_correctos.push(elArray)
    //     })
    //     var laData = [];

    //     const python1 = spawn('python', ['pickle_to_text_names.py', companyid]);
    //     await python1.stdout.on('data', (data) => {
    //         console.log('adentro names')
    //         laData.push(data);

    //     });
    //     await python1.stdout.on('close', async code => {
    //         let rawData = laData.join("")
    //         let edited = rawData.slice(1, rawData.length - 3)
    //         let listed = edited.split(',')
    //         let final = []
    //         listed.forEach(dni => {
    //             final.push(parseInt(dni.trim().slice(1, dni.length - 2)))
    //         })

    //         return res.json({ names: final, faces: encodings_correctos })
    //     })
    // })

})
userRouter.get('/get_user_info/:companyid', async (req, res) => {
    let companyid = req.params.companyid;
    const usuarios = await User.find({ companyID: companyid, createdAccount: true })
    res.json({ users: usuarios })

})
userRouter.get('/zip/:companyid', async (req, res) => {
    const dni = req.params.companyid
    var lionelmessi = [
        { path: './pickles/' + dni + '/known_names', name: 'known_names' },
        { path: './pickles/' + dni + '/known_faces', name: 'known_faces' }]
    res.zip(lionelmessi);
})

userRouter.post('/wipeFotos/:dni', async (req, res) => {
    const dni = req.params.dni;
    const companyid = req.body.companyid
    let path = 'fotitos/' + companyid + '/' + dni
    const user = await UserNew.findOne({ dni: dni })
    var modelo = user.modeloEntrenado;
    if (!modelo) {
        const deleteFolderRecursive = async function (path) {
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
                res.json({ message: 'todo ok', messageError: false })

                fs.rmdirSync(path);
            } else {
                res.json({ message: 'ENOENT no existe eso', messageError: true })
            }
        };
        deleteFolderRecursive(path);
    } else {
        var largeDataSet = []
        const python = spawn('python', ['delete.py', dni, companyid]);
        await python.stdout.on('data', async (data) => {
            largeDataSet.push(data);
            var dataaaa = largeDataSet.join("")
            res.json({ message: dataaaa })
            if (!dataaaa.startsWith("Err")) {
                var dni = req.params.dni;
                await UserNew.findOne({ dni: dni }, function (err, doc) {
                    if (err) return false;

                    doc.cantidadFotos = 0;
                    doc.modeloEntrenado = false;
                    doc.save();
                });
            }
        });
    }
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
        iss: "leo-mattioli",
        sub: userID
    }, "leo-mattioli", { expiresIn: "1h" });
}
userRouter.put('/register', async (req, res) => {
    const { username, password, dni, companyID, mail } = req.body;
    const user_ = await UserNew.find({ companyID: companyID, dni: dni, createdAccount: false })


    if (user_.length !== 0 && user_ !== []) {

        await UserNew.findOne({ dni: dni }, async function (err, doc) {
            if (err) return false;

            const users = await UserNew.find({ username: username })
            if (users.length === 0) {
                doc.password = password;
                doc.username = username;
                doc.mail = mail;
                doc.createdAccount = true;
                doc.save()
            } else {
                res.json({ message: { msgBody: "username taken", msgError: true } })

            }
            res.json({ message: { msgBody: "cuenta reg", msgError: false } })

        })


    } else {
        res.json({ message: { msgBody: "hubo un error", msgError: true } });
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


userRouter.post('/upload/:companyid/:dni', async function (req, res) {
    var params = {

    }

    var storage = multer.diskStorage({

        destination: function (req, file, cb) {
            const direccion1 = 'fotitos/' + req.body.companyID;
            const direccion2 = 'fotitos/' + req.body.companyID + '/' + req.body.username;
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
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
    })
    var collections = AWSManager.listCollections(params)
    if (!(req.body.companyID in collections)) {
        AWSManager.createCollection({ CollectionId: req.body.companyID })
        console.log("Aws creado")

    }
    fs.readdir(direccion2, (err, files) => {
        files.forEach(file => {

            var params = {
                CollectionId: req.body.companyID, /* required */
                Image: {
                    Bytes: Buffer.from(file)
                },
                ExternalImageId: req.body.companyID + req.body.username,
                MaxFaces: 1
            };
        })
    })
    console.log("Fotos subidas")

    await UserNew.findOne({ dni: dni }, function (error, doc) {
        doc.modeloEntrenado = true;
        doc.save();
    })

});
userRouter.post('/uploadPfp', async function (req, res) {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const direccion1 = 'users/' + req.body.companyID;
            const direccion2 = 'users/' + req.body.companyID + '/' + req.body.username;
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
            var extArr = file.originalname;
            let extensiones = ['.jpg', '.jpeg', '.png'];
            var extension = '';
            for (let i = 0; i < extensiones.length; i++) {
                if (extArr.includes(extensiones[i])) {
                    extension = extensiones[i]
                }
            }
            cb(null, req.body.username + extension)
        }
    })
    var upload = multer({ storage: storage }).array('file')
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        return res.status(200).send(req.file)

    })
});



userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, role, dni, companyID, mail, cantidadFotos } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role, dni, modeloEntrenado: false, companyID, mail, cantidadFotos } });
});


module.exports = userRouter;