import React, {useState, useCallback} from 'react';
import {useLocation} from "react-router";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./Loader";
import {useUser} from './hooks/user.hook'

export default function Form(props) {

    const emptyUserForm = {
        name: '',
        picture: '',
        description: ''
    }

    const [form, setForm] = useState(props.user || emptyUserForm);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { saveUser } = useUser();

    const changeInputHandler = (event) => {
        setForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const changeImageHandler = async (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setPhoto(file);
        await setForm(prev => ({
            ...prev,
            picture: url
        }))
    }

    const fetchImageToCloudinary = useCallback(async (picture) => {
        const formData = new FormData();
        formData.append('file', picture);
        formData.append('upload_preset', 'users_photo');
        const response =
            await fetch('https://api.cloudinary.com/v1_1/agul72/image/upload',
                {
                    method: 'POST',
                    body: formData
                });
        if (!response.ok) {
            throw new Error("Cloudinary uploading error:");
        }
        return await response.json();
    }, []);

    const changePictureUrl = useCallback((url) => {
        console.log(url);
        setForm(prev => ({
            ...prev,
            picture: url
        }));
    }, [])

    const submitHandler = async event => {
        event.preventDefault();
        if (!form.name.trim()) {
            return toast.info("Name is empty", {
                position: toast.POSITION.TOP_LEFT
            });
        }


            try {
                setLoading(true);
                if (photo) {
                    const image = await fetchImageToCloudinary(photo);
                    const cloudinaryImageUrl = image.secure_url;
                    await changePictureUrl(cloudinaryImageUrl);
                }
                switch (location.pathname) {
                    case '/create':
                        await saveUser('/api/user/', 'POST', form);
                        resetHandler(event);
                        break;
                    case '/update':
                        await saveUser('/api/user', 'PUT', form);
                        break;
                    default:
                        return;
                }
                setLoading(false);

            } catch (e) {
                console.log("Fetch user error:", e.message);
                setLoading(false);
            }

    }

    const resetHandler = (event) => {
        event.preventDefault();
        setForm(emptyUserForm);
    }

    return (
        <form
            onSubmit={submitHandler}
            onReset={resetHandler}
            className='mt-3'
        >
            <ToastContainer autoClose={2000}/>

            <div className={'form-group'}>
                <div className="row">
                    <div className="col">
                        <div className="mb-1">
                            <input
                                type="text"
                                className={'form-control'}
                                name={'name'}
                                value={form.name}
                                placeholder='Name...'
                                onChange={changeInputHandler}
                            />
                        </div>
                        <div className="mb-1">
                        <textarea
                            rows={5}
                            className={'form-control'}
                            name={'description'}
                            value={form.description}
                            placeholder='Description...'
                            onChange={changeInputHandler}
                        />
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-1">
                            <img
                                src={form.picture}
                                alt="Empty"
                                style={{height: 135 + "px",}}
                            />
                        </div>
                        <div className="mb-1">
                            <input
                                className="form-control"
                                type="file"
                                accept="image/*"
                                name={'picture'}
                                onChange={changeImageHandler}
                            />
                        </div>
                    </div>
                </div>
                <hr/>
                <div className='row'>
                    <button
                        className={'btn btn-success btn-sm mt-2 col-1'}
                        type={'submit'}
                    >
                        {location.pathname.toUpperCase().slice(1)}
                    </button>
                    {(location.pathname === '/update')
                        ? <button
                            className={'btn btn-secondary btn-sm mt-2 col-1'}
                            type={'reset'}
                        >
                            Reset
                        </button>
                        : null}
                </div>
                {loading ? <Loader/> : null}
            </div>

        </form>
    )
}
