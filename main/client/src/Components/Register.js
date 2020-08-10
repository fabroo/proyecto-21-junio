import React, { useState, useRef, useEffect } from 'react';
import AuthService from '../Services/AuthService';
import { Link } from 'react-router-dom'
import Message from '../Components/Message';

const Register = props => {
    const [user, setUser] = useState({ username: "", password: "", dni: "", companyID: "", mail: "" });
    const [message, setMessage] = useState(null);
    const [picture, setPicture] = useState(null);
    let timerID = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        }
    }, []);

    const onChangeHandler = (e) => {
        setPicture(e.target.files)
    }
    const onClickHandler = () => {
        const data = new FormData()
        data.append('username', user.dni)
        data.append('companyID', user.companyID)
        for (var x = 0; x < picture.length; x++) {
            let extensiones = ['.jpg', '.jpeg', '.png'];
            for (let i = 0; i < extensiones.length; i++) {
                if (picture[x].name.includes(extensiones[i])) {
                    data.append('file', picture[x])
                }
            }
        }
        AuthService.uploadPfp(data, user.username)

        timerID = setTimeout(() => {
            props.history.push('/');
        }, 3000)
    }
    const onChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const resetForm = () => {
        setUser({ username: "", password: "", dni: "", companyID: "", mail: "" });
    }

    const onSubmit = e => {
        e.preventDefault();
        //console.log('user: ' + JSON.stringify(user))

        AuthService.register(user).then(data => {
            const { message } = data.data;
            setMessage(message);
            resetForm();
            if (!message.msgError) {
                onClickHandler()
                timerID = setTimeout(() => {
                    props.history.push('/login');
                }, 2000)
            }
        });

    }



    return (
        <div className="container " style={{ margin: '20vh auto auto auto' }}>
            <form onSubmit={onSubmit}>
                <h3>Please Register</h3>
                <div className="col-md-6" style={{ margin: 'auto auto' }}>
                    <label className="custom-file-label " htmlFor="holu" >Choose file</label>
                    <input required={true} type="file" onChange={onChangeHandler} name="holu" className="custom-file-input form-control m" id="customFile" accept="image/png,image/jpg" />

                </div>
                <label htmlFor="username" className="sr-only">Username: </label>
                <input type="text"
                    name="username"
                    value={user.username}
                    onChange={onChange}
                    className="form-control m-2"
                    placeholder="Enter Username" />
                <div className="row">
                    <div className="col-md-12 ">
                        <label htmlFor="password" className="sr-only">Password: </label>
                        <input type="password"
                            name="password"
                            value={user.password}
                            onChange={onChange}
                            className="form-control m-2"
                            placeholder="Enter Password" />
                    </div>

                </div>
                <label htmlFor="mail" className="sr-only">mail: </label>
                <input type="text"
                    name="mail"
                    value={user.mail}
                    onChange={onChange}
                    className="form-control m-2"
                    placeholder="Enter mail " />
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="dni" className="sr-only">dni: </label>
                        <input type="text"
                            name="dni"
                            value={user.dni}
                            onChange={onChange}
                            className="form-control m-2"
                            placeholder="Enter dni " />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="companyID" className="sr-only">companyId: </label>
                        <input type="text"
                            name="companyID"
                            value={user.companyID}
                            onChange={onChange}
                            className="form-control m-2"
                            placeholder="Enter company Id " />

                    </div>


                </div>

                <button className="btn  btn-primary m-2 row"
                    type="submit">Register</button>
                <div className="d-flex justify-content-end">
                    <p className="">Ya tenes cuenta? <Link to="/login">Inicia Sesion</Link></p>

                </div>
            </form>
            {message ? <Message message={message} /> : null}
            <br />
        </div>
    )
}

export default Register;