import React, {useState} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserItem from "./UserItem";
import Loader from "./Loader";
import {useUser} from "./hooks/user.hook";
import {Link} from "react-router-dom";

function SearchPage() {

    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getUsersByName, getAllUsers, removeUser } = useUser();

    const submitHandler = async (event) => {
        event.preventDefault();
        if (!name.trim()) {
            return toast.info("Name is empty", {
                position: toast.POSITION.TOP_LEFT
            });
        }
        setLoading(true);
        const result = await getUsersByName(name);
        setLoading(false);
        setUsers(result);
    }

    const resetHandler = async (event) => {
        event.preventDefault();
        setUsers([]);
        setName('');
    }

    const changeInputHandler = (event) => {
        setName(event.target.value);
    }

    const btnRemoveHandler = async (id) => {
        try {
            await removeUser(id);
            getAllUsers().then(users => {
                setUsers(users);
            })
        } catch (e) {
            console.log('btnRemoveHandler', e.message);
            toast.error(e.message, {
                position: toast.POSITION.TOP_LEFT
            });
        }
    }

    return (
        <div className="container mt-3">
            <form
                onSubmit={submitHandler}
                onReset={resetHandler}
            >
                <ToastContainer autoClose={2000}/>
                <div className={'form-group'}>
                    <div className="row">
                        <input
                            type="text"
                            className='form-control col-10'
                            name={'name'}
                            value={name}
                            placeholder='Enter name ...'
                            onChange={changeInputHandler}
                        />
                        <button
                            className='btn btn-success col-1'
                            type={'submit'}
                        >Find
                        </button>
                        <button
                            className='btn btn-secondary col-1'
                            type={'reset'}
                        >Reset
                        </button>
                    </div>
                </div>
                {loading
                    ? <Loader/>
                    : null}
                {users.map((user) =>
                    <div className='card mb-2' key={user._id}>
                        <div className="card-body">
                            <div className='row'>
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
            </form>
        </div>
    )
}

export default SearchPage;
