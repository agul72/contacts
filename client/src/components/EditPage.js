import React from 'react';
import Form from "./Form";

export const EditPage = ({ location }) => {
    const user = location.user;
    console.log(user)
    return (
        <Form user={user}/>
    )
}
