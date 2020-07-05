import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext';
import AuthService from '../Services/AuthService';
import swal from 'sweetalert';

const Admin = props => {

    const { user } = useContext(AuthContext);
    let [content, setContent] = useState(null)
    let [elinput, setElInput] = useState({ dni: 0, role: "user", username: "" })

    let [registradoClass, setRegistradoClass] = useState({ style: { display: 'none', margin: 'auto .5rem' } })
    let [noregistradoClass, setNoRegistradoClass] = useState({ style: { display: 'none', margin: 'auto .5rem' } })
    let [add, setAdd] = useState({ style: { display: 'none', margin: 'auto .5rem' } })
    let [load, setLoad] = useState({ style: { display: 'block', margin: 'auto .5rem' } })


    const showData = () => {

        AuthService.getData(user.companyID).then(res => {
            setContent(res.data.sort(function (a, b) {
                if (a.username < b.username) { return -1; }
                if (a.username > b.username) { return 1; }
                return 0;
            }));

            setAdd({ style: { display: 'block' } })
        }, [])
    }
    const showRegister = (e) => {
        setLoad({ display: 'none' })
        setAdd({ display: "none" })

        setRegistradoClass({ display: 'none' })
        setNoRegistradoClass({ display: 'block' })

        console.log('http://' + String(process.env.LA_IP) + ':5000/user/register');
        AuthService.getData(user.companyID).then(res => {
            const all = res.data;
            const users = [];

            all.map(user => {
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
    }
    const showUnRegister = (e) => {
        setRegistradoClass({ display: 'block' })
        setAdd({ display: "block" })
        setNoRegistradoClass({ display: 'none' })
        AuthService.getData(user.companyID).then(res => {
            const all = res.data;
            const users = [];

            all.map(user => {
                if (!user.createdAccount) {
                    users.push(user)
                }
            })
            if (users.length === 0) {
                swal('No hay sin registrarse')
            }
            else {
                setContent(users.sort(function (a, b) {
                    if (a.username < b.username) { return -1; }
                    if (a.username > b.username) { return 1; }
                    return 0;
                }));
            }
        }, [])

    }
    const chau = (dni) => {
        swal("Estas seguro de ello? No podras volver atrás", {
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
                        AuthService.removeUser(dni).then(res => {
                            showRegister()
                        }, [])
                        break;

                    default:

                }
            });
    }
    const registrarNuevo = async () => {
        const dni = elinput.dni;
        const role = elinput.role;
        const username = String(dni);
        const companyid = user.companyID
        await AuthService.registerNew({ dni: dni, companyID: user.companyID, role: role, username: username,companyid:companyid }).then(res => {
            console.log(res)
        }, [])

        showUnRegister()

    }
    const download = () =>{
        AuthService.downloadP(user.companyID).then(res =>{
            download(res)
        })
    }
    const handleChange = (e) => {
        setElInput({ ...elinput, [e.target.name]: e.target.value });
    }
    const wipeFotos = async (user) => {
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
                                console.log(res)
                            })
                            AuthService.getData(user.companyID).then(res => {
                                const all = res.data;
                                const users = [];

                                all.map(user => {
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
            <a href={"http://192.168.1.203:5000/user/download/"+user.companyID}className="display-4  text-center"><h2>Dowload</h2></a>

            <div className="arriba d-flex flex-row-reverse">
                <div className="botonera" style={{ display: 'flex' }} >
                    <button style={load} className="btn  btn-warning m-2" onClick={showRegister}>LOAD..</button>
                    <button className="btn btn-primary m-2 none" style={registradoClass} onClick={showRegister}>REGISTRADOS</button>
                    <button className="btn btn-secondary m-2 none" style={noregistradoClass} onClick={showUnRegister}>NO REGISTRADOS</button>
                    <button style={add} type="button" className="btn btn-info m-2 none" data-toggle="modal" data-target="#exampleModalCenter"> +</button>

                </div>
                {/* <button className="btn btn-info">+</button> */}

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

                                    <td>{user.username == user.dni ? (<p>No registrado</p>) : (<p>{user.username}</p>)}</td>
                                    <td ><p>{user.dni}</p></td>
                                    <td><p><a rel="noopener noreferrer" href={"https://mail.google.com/mail/u/0/?view=cm&fs=1&to=" + user.mail + "&tf=1"} target="_blank">{user.museail}</a></p></td>
                                    <td> {!user.modeloEntrenado ? <p>no</p> : <p>si</p>}</td>
                                    <td>{user.createdAccount ? <img className="img-fluid" style={{ width: '100px' }} src={'http://192.168.1.203:5000\\user\\pfp\\' + user.companyID + '\\' + user.dni} alt="" /> : (<p>no hay :(</p>)}</td>

                                    <td><p>{user.role}</p></td>
                                    <td><p onClick={() => wipeFotos(user)}>{user.cantidadFotos}</p></td>

                                    <td> {user.role !== "admin" ? (<button className="btn btn-danger" onClick={() => chau(user._id)}>X</button>) : (<p>es admin bro</p>)} </td>
                                </tr>)

                        ) : (<tr><td>No content...</td></tr>)}
                    </tbody>
                </table>
            </div>

            <br />
            <br />

        </div>

    )
}
export default Admin