import React from 'react'


const getStyle = (props) => {
    let baseClass = "alert ";
    try {
        if (props.message.msgError)
            baseClass = baseClass + "alert-danger";
        else
            baseClass = baseClass + "alert-primary";
        return baseClass + " text-center";
    } catch (error) {

    }
}

const Message = props => {
    return (
        <div className={getStyle(props)} role="alert">
            {props.message.msgBody ? props.message.msgBody : props.message}
        </div>
    )
}

export default Message;