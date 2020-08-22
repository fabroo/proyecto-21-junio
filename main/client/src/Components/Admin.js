import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import swal from 'sweetalert';

const Admin = props => {

    //actual user
    const { user } = useContext(AuthContext);


    let [content, setContent] = useState(null) //list of company users
    let [elinput, setElInput] = useState({ dni: 0, role: "user" }) //create new company user 

    //button classes
    let [registradoClass, setRegistradoClass] = useState({ style: { display: 'none', margin: 'auto .5rem' } })
    let [noregistradoClass, setNoRegistradoClass] = useState({ style: { display: 'none', margin: 'auto .5rem' } })

    let [loading, isLoading] = useState(false); //loading message

    useEffect(() => { //fetch user list at the beggining

        isLoading(true) //begin to load

        async function showw() {
            AuthService.getData(user.companyID).then(res => {
                //consts
                const all = res.data;
                const users = [];

                all.forEach(user => { //only display registered users
                    if (user.createdAccount) {
                        users.push(user)
                    }
                })

                setContent(users.sort(function (a, b) { //sort users alphabetically
                    if (a.username < b.username) { return -1; }
                    if (a.username > b.username) { return 1; }
                    return 0;
                }));
                isLoading(false) //done loading

                setRegistradoClass({ display: 'block' })
                setNoRegistradoClass({ display: 'block' })
            }, [])
        }
        showw()

    }, [user.companyID]); //si se rompe saca lo de aca adentro

    const showWich = (yesOrNo) => { //only users depending if they are registered or not
        if (yesOrNo) { //set the button classes
            setRegistradoClass({ display: 'none' })
            setNoRegistradoClass({ display: 'block' })
        } else {
            setRegistradoClass({ display: 'block' })
            setNoRegistradoClass({ display: 'none' })
        }
        //get company users
        AuthService.getData(user.companyID).then(res => {
            const all = res.data;
            const users = [];

            all.forEach(user => {
                if (yesOrNo) {
                    if (user.createdAccount) {
                        users.push(user)
                    }
                } else {
                    if (!user.createdAccount) {
                        users.push(user)
                    }
                }
            })
            //sort them
            setContent(users.sort(function (a, b) {
                if (a.username < b.username) { return -1; }
                if (a.username > b.username) { return 1; }
                return 0;
            }));
        }, [])
    }
    //delete users
    const chau = (dni) => {
        swal("Estas seguro de ello? No podras volver atrás", { //ask for second thoughts uwu
            buttons: {
                cancel: "Cancelar",
                catch: {
                    text: "Eliminar",
                    value: "borrar",
                }
            },
        })
            .then((value) => {
                switch (value) {

                    case "borrar":
                        swal("Eliminado", "El trabajador no forma mas parte de la empresa", "success");
                        AuthService.removeUser(dni).then(res => { //remove function
                            showWich(true);
                        }, [])
                        break;

                    default:

                }
            });
    }
    //create new user
    const registrarNuevo = async () => {
        //user data
        const dni = elinput.dni;
        const role = elinput.role;
        const username = String(dni); //until the user creates his account the username will be his DNI
        const companyid = user.companyID


        await AuthService.registerNew({ dni: dni, companyID: user.companyID, role: role, username: username, companyid: companyid }).then(res => {
            !res.data.message.msgError ? (swal('Nice!', res.data.message.msgBody)) : (swal('Error!', res.data.message.msgBody))
        }, [])

        showWich(false)

    }

    const handleChange = (e) => { //handle the create user input
        setElInput({ ...elinput, [e.target.name]: e.target.value });
    }
    const wipeFotos = async (user) => { //eliminar los datos del usuario en el pickle
        let dni = user.dni
        let companyID = user.companyID
        if (user.cantidadFotos > 0 && user.createdAccount) {
            swal("Estas seguro de ello? No podras volver atrás", {
                buttons: {
                    cancel: "Cancelar",
                    catch: {
                        text: "Eliminar",
                        value: "borrar",
                    }
                },
            })
                .then(async (value) => {
                    switch (value) {

                        case "borrar":
                            swal("Eliminado", "Imagenes eliminadas", "success");
                            await AuthService.wipeFotos(dni, companyID).then(res => {
                                //console.log(res)
                            })
                            AuthService.getData(user.companyID).then(res => {
                                const all = res.data;
                                const users = [];

                                all.forEach(user => {
                                    if (user.createdAccount) {
                                        users.push(user)
                                    }
                                })

                                setContent(users.sort(function (a, b) {
                                    if (a.username < b.username) { return -1; }
                                    if (a.username > b.username) { return 1; }
                                    return 0;
                                }));
                            }, [])
                            break;

                        default:

                    }
                });

        } else {
            swal({
                icon: 'error',
                title: 'Oops...',
                text: 'O no hay fotos o no está registrado..',
                footer: 'Volve a intentar'
            })
        }
    }

    return (
        <div className="container" >
            <h1 className="display-4 m-4 text-center">Código: "{user.companyID}"</h1>
            <a href={"http://192.168.1.203:5000/user/download/" + user.companyID} className="display-4  text-center"><h2>Dowload</h2></a>

            <div className="arriba d-flex flex-row-reverse">
                <div className="botonera" style={{ display: 'flex' }} >
                    <button className="btn btn-primary m-2 none" style={registradoClass} onClick={() => showWich(true)}>REGISTRADOS</button>
                    <button className="btn btn-secondary m-2 none" style={noregistradoClass} onClick={() => showWich(false)}>NO REGISTRADOS</button>
                    <button type="button" className="btn btn-info m-2" data-toggle="modal" data-target="#exampleModalCenter"> +</button>

                </div>
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">New User</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="number"
                                    placeholder="User's DNI"
                                    required
                                    name="dni"
                                    className="form-control form-control-lg"
                                    value={elinput.dni}
                                    onChange={handleChange} />
                                <br /><br />
                                <select name="role" className="form-control form-control-lg" onChange={handleChange} value={elinput.role}>
                                    <option value="admin">admin</option>
                                    <option value="user">user</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => registrarNuevo()}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!loading ? (
                <div>
                    <table className="table table-hover text-center table-responsive-lg">
                        <thead className="thead-dark">
                            <tr>
                                <th className="">Nombre</th>
                                <th className="">DNI</th>
                                <th className="">E-Mail</th>
                                <th className="">Modelo Entrenado?</th>
                                <th className="">Profile Picture</th>
                                <th className="">Rol</th>
                                <th className="">Cantidad de Fotos</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content ? (
                                content.map(user =>
                                    <tr key={user._id}>

                                        <td>{!user.createdAccount ? (<p>No registrado</p>) : (<p>{user.username}</p>)}</td>
                                        <td ><p>{user.dni}</p></td>
                                        <td>{user.createdAccount ? (<p><a rel="noopener noreferrer" href={"https://mail.google.com/mail/u/0/?view=cm&fs=1&to=" + user.mail + "&tf=1"} target="_blank">{user.mail}</a></p>) : (<p>No creada</p>)}</td>
                                        <td> {!user.modeloEntrenado ? <p>no</p> : <p>si</p>}</td>
                                        <td>{user.createdAccount ? <img className="img-fluid" style={{ width: '100px',height:'100px',objectFit:'cover' }} src={'http://192.168.1.203:5000\\user\\pfp\\' + user.companyID + '\\' + user.dni} alt={user.username} /> : (<p>no hay :(</p>)}</td>

                                        <td><p>{user.role}</p></td>
                                        <td><p onClick={() => wipeFotos(user)}>{user.cantidadFotos}</p></td>

                                        <td> {user.role !== "admin" ? (<button className="btn btn-danger" onClick={() => chau(user._id)}>X</button>) : user.role !== "mod" ? ((<button className="btn btn-danger" onClick={() => chau(user._id)}>X</button>)) : (<p>es admin bro</p>)} </td>
                                    </tr>)

                            ) : (<tr><td>No content...</td></tr>)}
                        </tbody>
                    </table>
                </div>
            ) : (<h1>It is loading!</h1>)}
        </div>

    )
}
export default Admin