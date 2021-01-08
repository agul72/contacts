import React from 'react';

export default function UserItem({user}) {

    return (
        <div className="row">
            <div className="col-4">
                <img
                    src={user.picture.replaceAll('&#x2F;', '/')}
                    style={{maxWidth: 150 + 'px'}}
                    alt="Empty"
                />
            </div>
            <div className="col-8">
                <h5 className='card-title'>{user.name}</h5>
                <p className='card-text'>{user.description}</p>
            </div>
        </div>
    )
}
