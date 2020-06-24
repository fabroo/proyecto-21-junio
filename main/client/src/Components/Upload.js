import React, { useState, useContext } from 'react';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';

const Upload = props => {
    const [picture, setPicture] = useState(null);
    const { user } = useContext(AuthContext);
    const [style, setStyle] = useState({ display: { width: '0%' } })
    const [porcentaje, setPorcentaje] = useState({ porcentaje: '0%' })

    const onChangeHandler = (e) => {
        setStyle({ width: '0%' })
        setPicture(e.target.files)

    }

    const onClickHandler = () => {
        const data = new FormData()
        data.append('username', user.dni)
        for (var x = 0; x < picture.length; x++) {

            let extensiones = ['.jpg', '.jpeg', '.png'];

            for (let i = 0; i < extensiones.length; i++) {

                if (picture[x].name.includes(extensiones[i])) {
                    data.append('file', picture[x])
                }

            }
            setStyle({ width: (x + 1 / picture.length) * 100 + '%' })
            setPorcentaje({porcentaje:(x + 1 / picture.length) * 100 + '%'})

        }


        AuthService.upload(data, user.username)

    }
    return (
        <div className="container">

            <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">
            <h1 class="display-4 m-4 ">Fotos:</h1>

                    
                    <div class="custom-file m-4">
                        
                        <input type="file" multiple onChange={onChangeHandler} class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile">Choose file</label>
                        <br /><br /><br></br>

                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style={style} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">{porcentaje.porcentaje}</div>
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
        </div>
    )
}

export default Upload;