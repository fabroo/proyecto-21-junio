import React, {useState,useContext,useEffect} from 'react';
import TodoItem from './TodoItem';
import TodoService from '../Services/TodoService';
import Message from './Message';
import { AuthContext } from '../Context/AuthContext';

const Todos = props =>{
    const [todo,setTodo] = useState({name : ""});
    const [todos,setTodos] = useState([]);
    const [message,setMessage] = useState(null);
    const authContext = useContext(AuthContext);
    
    useEffect(()=>{
        TodoService.getTodos().then(data =>{
            setTodos(data.todos);
        });
    },[]);

    const onSubmit = e =>{
        e.preventDefault();
        TodoService.postTodo(todo).then(data =>{
            const { message } = data;
            resetForm();
            if(!message.msgError){
                TodoService.getTodos().then(getData =>{
                    setTodos(getData.todos);
                    setMessage(message);
                });
            }
            else if(message.msgBody === "UnAuthorized"){
                setMessage(message);
                authContext.setUser({username : "", role : ""});
                authContext.setIsAuthenticated(false);
            }
            else{
                setMessage(message);
            }
        });
    }

    const onChange = e =>{
        setTodo({name : e.target.value});
    }

    const resetForm = ()=>{
        setTodo({name : ""});
    }

    return(
        <div className="container">
            {message ? <Message message={message}/> : null}
            <form onSubmit={onSubmit}>
                <label htmlFor="todo"><h2>Enter Todo</h2></label>
                <input type="text" 
                       name="todo" 
                       value={todo.name} 
                       onChange={onChange}
                       className="form-control m-3"
                       placeholder="Please Enter Todo"/>
                <button className="btn  btn-primary m-2" 
                        type="submit">Submit</button>
            </form>
            <ul className="list-group">
                {
                    todos.map(todo =>{
                        return <TodoItem key={todo._id} todo={todo}/>
                    })
                }
            </ul>
            <br/>
            
        </div>
    );

}

export default Todos;