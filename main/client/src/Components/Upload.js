import React, { useState, useContext, useEffect } from 'react';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';
import swal from 'sweetalert';
import axios from 'axios'


const Upload = props => {
    const [picture, setPicture] = useState(null);
    const { user } = useContext(AuthContext);
    const [style, setStyle] = useState({ display: { width: '0%' } })
    const [porcentaje, setPorcentaje] = useState({ porcentaje: '0%' })
    const [fotos, setFotos] = useState({ cantidad: 0 })


    const onChangeHandler = (e) => {

        setStyle({ width: '0%' })
        setPicture(e.target.files)
        setFotos({ cantidad: e.target.files.length })

    }


    const onClickHandler = () => {
        if (fotos.cantidad > 0) {
            AuthService.getFotos(user.dni).then(res => {
                if (res <= 20 || res.data.cantidad + fotos.cantidad <= 20) {
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
                        setStyle({ width: (x + 1 / picture.length) * 100 + '%' })
                        setPorcentaje({ porcentaje: (x + 1 / picture.length) * 100 + '%' })
       
                    }
                    AuthService.upload(data, user.username,user.companyID).then(res =>{
                        swal(res.data.message)
                    })
                    AuthService.addFotos(user.dni, fotos)
                    swal({
                        icon: 'success',
                        title: 'Nice',
                        text: "fotos subidas"
                    })
                   
                } else {
                    swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Estas intentando subir mas fotos de las que puedes, llevas: " + res.data.cantidad + " y quisiste subir " + fotos.cantidad + ", el maximo es 20",
                        footer: 'Volve a intentar'
                    })

                }
            })
        } else {
            swal({
                icon: 'error',
                title: 'Oops...',
                text: 'Intentaste entregar vacio pa',
                footer: 'Volve a intentar'
            })
        }




    }
    return (
        <div className="container">

            <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">
                    <h1 className="display-4 m-4 ">Fotos:</h1>
                    <p className="text-center">Subiste {fotos.cantidad} foto(s)</p>
                    <div className="custom-file m-4">
                        <br /><br />
                        <input type="file" multiple onChange={onChangeHandler} name="holu" className="custom-file-input" id="customFile" accept="image/png, image/jpeg,image/jpg" />
                        <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                        <br></br>
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={style} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">{porcentaje.porcentaje}</div>
                        </div>
                        <br /><br /><br></br>
                        <button type="button" className="btn btn-info" onClick={onClickHandler}>Upload</button>
                    </div>
                </div>
                <div className="col-sm"></div>
            </div>
            <br /><br /><br />
            <div className="container">
            </div>
            <br /><br />
        </div>
    )
}

export default Upload;