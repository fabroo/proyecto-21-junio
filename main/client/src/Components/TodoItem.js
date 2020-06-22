import React from 'react';

const TodoItem = props =>{
    return (
        <p className="bg-light p-3 m-1"> <b>nota: </b>{props.todo.name}</p>
    )
}

export default TodoItem;