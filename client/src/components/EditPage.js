import React from 'react';
import Form from "./Form";

export const EditPage = ({ location }) => {
    const user = location.user;
    user.picture = user.picture.replaceAll('&#x2F;', '/')
    console.log(user)
    return (
        <Form user={user}/>
    )
}
