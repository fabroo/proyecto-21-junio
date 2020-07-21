import React, {useState,useContext} from 'react';
import AuthService from '../Services/AuthService';
import Message from '../Components/Message';
import {AuthContext} from '../Context/AuthContext';
import '../index.css'

const Login = props=>{
    const [user,setUser] = useState({username: "", password : ""});
    const [message,setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    }

    const onSubmit = e =>{
        e.preventDefault();
        AuthService.login(user).then(data=>{
            const { isAuthenticated,user,error} = data;
            if(isAuthenticated){
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);
                props.history.push('/');
                
            }
            if(error){
                //console.log(error)
                setMessage('usuario incorrecto');
            }
            
        });
    }



    return(
        <div className="container p-2 loginn">

            <form onSubmit={onSubmit}>
                <div className="row">
                    <div className="col-6 offset-3">
            {message ? <Message message={message}/> : null}

                <h3 id="uwu">Please sign in</h3>

                    <label htmlFor="username" className="sr-only">Username: </label>
                <input type="text" 
                       name="username" 
                       onChange={onChange}
                        
                       className="form-control m-2 input-login" 
                       placeholder="Enter Username"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 offset-3">
                    <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       name="password" 
                       onChange={onChange} 
                       
                       className="form-control m-2 input-login" 
                       placeholder="Enter Password"/>
                <button className="btn btn-primary m-2 " 
                        type="submit" style={{margin:' auto'}}>Log in </button>

                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login;