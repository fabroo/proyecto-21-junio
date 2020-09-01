const express = require('express');
const userRouter = express.Router();
const UserNew = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const Path = require('path');
const { spawn } = require('child_process');

userRouter.get('/hola' , (req,res) =>{
    res.json({asdasd:"hollll"})
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
        const python = spawn('python', ['./python/delete.py', dni, companyid]);
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
userRouter.post('/upload/:companyid/:dni', async function (req, res) {
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
    var resultadoCheck = [];
    var python = spawn('python', ['./python/check.py', req.params.companyid]);
    console.log('antes')
    await python.stdout.on('data', (data) => {
        console.log('durante')
        resultadoCheck.push(data);
    });

    await python.stdout.on('close', async code => {
        console.log('despues')
        let yes = (resultadoCheck.join(""))

        if (yes.includes(String(req.params.dni))) {
            var largeDataSet = [];
            console.log("addnewPics")
            python = spawn('python', ['./python/addExtraPics.py', req.params.dni, req.params.companyid])
            
            await python.stdout.on('data', (data) => {
                console.log('adentro funco add pics')
                largeDataSet.push(data);
               res.json({ message: largeDataSet.join("") })
            });

            await python.stdout.on('close', async (code) => {
                console.log('final')
                var check_result = [];
                var python = spawn('python', ['./python/check.py', req.params.companyid]);
                var arr = [];
                var arrFixed = []
                console.log('antes')
                await python.stdout.on('data', (data) => {
                    console.log('durante')
                    check_result.push(data);
                });
                await python.stdout.on('close', async code => {
                    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
                    arr = check_result.join("").slice(1, check_result.join("").length - 3).split(",")
                    console.log('arr',arr)
                    arr.forEach((user) => {
                        var user1 = user.trim()
                        var user2 = user1.slice(1, user1.length - 1)
                        arrFixed.push((user2))
                    })
                    var numberOfOccurrencies = (countOccurrences(arrFixed, req.params.dni))
                    console.log("number of",numberOfOccurrencies)
                    await UserNew.findOne({ dni: req.params.dni }, function (err, doc) {
                        doc.cantidadFotos = numberOfOccurrencies;
                        doc.save();
                    });

                })
            });

        }
        else {
            if (fs.existsSync('./pickles/' + req.params.companyid + '/known_names')) {
                var largeDataSet = [];
                console.log('train bien')
                python = spawn('python', ['./python/train-pero-bien.py', req.params.companyid]);

                await python.stdout.on('data', async (data) => {
                    console.log('adentro funco train bien')
                    largeDataSet.push(data);
                    var fullData = largeDataSet.join("")
                    res.json({ message: fullData })
                    if (!fullData.startsWith("Err")) {
                        //ACA YA SE AGREGAN NUEVAS COSAS AL PICKLE
                        var dni = req.params.dni;
                        console.log('adentro train bien')

                        await UserNew.findOne({ dni: dni }, function (err, doc) {
                            doc.modeloEntrenado = true;
                            doc.save();
                        });
                    }

                });
                await python.stdout.on('close', async (code) => {
                    console.log('final')
                    var check_result = [];
                    var python = spawn('python', ['./python/check.py', req.params.companyid]);
                    var arr = [];
                    var arrFixed = []
                    console.log('antes')
                    await python.stdout.on('data', (data) => {
                        console.log('durante')
                        check_result.push(data);
                    });
                    await python.stdout.on('close', async code => {
                        console.log('adentro del close')
                        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
                        arr = check_result.join("").slice(1, check_result.join("").length - 3).split(",")
                        arr.forEach((user) => {
                            var user1 = user.trim()
                            var user2 = user1.slice(1, user1.length - 1)
                            arrFixed.push((user2))
                        })
                        var numberOfOccurrencies = (countOccurrences(arrFixed, req.params.dni))
                        console.log(numberOfOccurrencies)

                        await UserNew.findOne({ dni: req.params.dni }, function (err, doc) {
                            doc.cantidadFotos = numberOfOccurrencies;
                            doc.save();
                        });
                        console.log('cambiado')
                    })
                });
            } else {
                var largeDataSet = [];
                python = spawn('python', ['./python/train-lento.py', './fotitos/' + req.params.companyid, req.params.companyid]);
                console.log('en el medio // train lento')
                await python.stdout.on('data', async (data) => {
                    console.log('adentro funco train lento')
                    largeDataSet.push(data);
                    var fullData = largeDataSet.join("")
                    res.json({ message: largeDataSet.join("") })
                    if (!fullData.startsWith("Err")) {
                        //ACA SE AGREGAN NUEVAS COSAS AL PICKLE
                        var dni = req.params.dni;
                        await UserNew.findOne({ dni: dni }, function (err, doc) {
                            doc.modeloEntrenado = true;
                            doc.save();
                        });
                    }

                });
                await python.stdout.on('close', async (code) => {
                    console.log('final')
                    var check_result = [];
                    var python = spawn('python', ['./python/check.py', req.params.companyid]);
                    var arr = [];
                    var arrFixed = []
                    console.log('antes')
                    await python.stdout.on('data', (data) => {
                        console.log('durante')
                        check_result.push(data);
                    });
                    await python.stdout.on('close', async code => {
                        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
                        arr = check_result.join("").slice(1, check_result.join("").length - 3).split(",")
                        arr.forEach((user) => {
                            var user1 = user.trim()
                            var user2 = user1.slice(1, user1.length - 1)
                            arrFixed.push((user2))
                        })
                        var numberOfOccurrencies = (countOccurrences(arrFixed, req.params.dni))
                        await UserNew.findOne({ dni: req.params.dni }, function (err, doc) {
                            doc.cantidadFotos = numberOfOccurrencies;
                            doc.save();
                        });
                    })
                });
            }
        }

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

module.exports = userRouter;
