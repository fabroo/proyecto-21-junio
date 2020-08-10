
import React, {useState} from 'react';
import AuthService from '../Services/AuthService';
import Message from '../Components/Message';

const Python = props=>{
    const [user,setLink] = useState({link:""});
    const [message,setMessage] = useState(null);


    const onChange = e =>{
            setLink({link : e.target.value});
    }
    const resetForm = ()=>{
        setLink({link:""});
    }
    const onSubmit = e =>{
        e.preventDefault();
        AuthService.postPython(user).then(data=>{
            //console.log(data)
            let yes = ((data).data.message)
            setMessage({msgBody:"el link es: "+ yes})
            resetForm();
            
        });
    }

    return(
        <div className=" ">
            <form onSubmit={onSubmit}>
    <h4>Link:</h4>
                <label htmlFor="username" className="sr-only">Link: </label>
                <input type="text" name="link" value={user.link} onChange={onChange} className="form-control m-2" required placeholder="https://campus.belgrano.ort.edu.ar/tic/2020-nr4a"/>
                       
                <button className="btn  btn-primary m-2" type="submit">Convertir</button>
            </form>
            {message ? <Message message={message}/> : null}

        </div>
    )
}

export default Python;