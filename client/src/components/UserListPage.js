import React, {useState, useCallback, useEffect} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserItem from "./UserItem";
import Loader from "./Loader";
import { useUser } from './hooks/user.hook'
import {Link} from "react-router-dom";

function UserListPage() {

    const [filter, setFilter] = useState("");
    const [users, setUsers] = useState([]);
    const { getAllUsers, removeUser } = useUser();
    const [filterUsers, setFilterUsers] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('Use effect')
        setLoading(true);
        try {
            getAllUsers().then(users => {
                setUsers(users);
            });
            setLoading(false);
        } catch (e) {
            console.log('getAllUsers', e.message);
            toast.error(e.message, {
                position: toast.POSITION.TOP_LEFT
            })
            setLoading(false);
        }
    }, [getAllUsers]);

    useEffect(() => {
        setFilterUsers(users);
    }, [users]);

    const resetHandler = async event => {
        event.preventDefault();
        await setFilter("");
        await setFilterUsers(users);
    }

    const changeFilter = useCallback((filter) => {
        setFilter(filter);

        if (filter.trim()) {
            setFilterUsers(users.filter((user) =>
                user.name.toLowerCase().includes(filter.toLowerCase())
            ))
        } else {
            setFilterUsers(users);
        }
    }, [users]);

    const changeInputHandler = async (event) => {
        await changeFilter(event.target.value);
    }

    const btnRemoveHandler = async (id) => {
        try {
            setLoading(true);
            await removeUser(id);
            getAllUsers().then(users => {
                setUsers(users);
            });
            setLoading(false);
        } catch (e) {
            console.log('btnRemoveHandler', e.message);
            toast.error(e.message, {
                position: toast.POSITION.TOP_LEFT
            })
            setLoading(false);
        }
    }

    return (
        <div className="container mt-3">
            <ToastContainer autoClose={2000}/>
            <form onReset={resetHandler}>
                <div className={'form-group'}>
                    <div className="row">
                        <input
                            type="text"
                            className={'form-control col'}
                            name={'filter'}
                            value={filter}
                            placeholder="Filter..."
                            onChange={changeInputHandler}
                        />
                        <button
                            className={'btn btn-success col-1'}
                            type={'reset'}
                        >Reset
                        </button>
                    </div>
                </div>
            </form>
            {!filterUsers.length
                ? <div className="container mt-3">
                    <p>List is empty</p>
                </div>
                : null
            }

            { loading ? <Loader/> : null }

            {filterUsers.map((user) =>
                <div className='card mb-2' key={user._id}>
                    <div className="card-body">
                        <div className='row' >
                            <div className='col-10'>
                                <UserItem
                                    user={user}
                                />
                            </div>

                            <div className='col-2'>
                                <Link to={{pathname: '/update', user: user}}>
                                    <button
                                        className="btn btn-warning col-12"
                                    >
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    className="btn btn-danger col-12"
                                    onClick={() => btnRemoveHandler(user._id)}
                                >
                                    Remove
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    )
}


export default UserListPage;

