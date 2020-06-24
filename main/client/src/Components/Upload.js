import React, {useState,useContext} from 'react';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';

const Upload = props =>{
    const [picture, setPicture] = useState(null);
    const { user } = useContext(AuthContext);
    
    const onChangeHandler= (e) =>{

        setPicture(e.target.files)
    
    }

    const onClickHandler = () => {
        const data = new FormData()
        data.append('username', user.dni) 
        for(var x = 0; x<picture.length; x++) {

         let extensiones = ['.jpg','.jpeg','.png'];

         for(let i = 0; i<extensiones.length;i++){

            if(picture[x].name.includes(extensiones[i])){
                data.append('file', picture[x])
            }
        }
        }
        
        
        AuthService.upload(data, user.username)
        
    }
    return (
        <div className="container">
             <input type="file" name="file" multiple onChange={onChangeHandler}/>
             <br></br>
             <button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>Upload</button>
        </div>
    )
}

export default Upload;