import {useCallback, useState} from "react";
import {toast} from "react-toastify";

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        setLoading(true);

        try {

            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, { method, body, headers });
            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.message || 'Something wrong')
            }

            setLoading(false);

            return data;

        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const getAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            const resp = await fetch('/api/user/all');
            setLoading(false);
            return await resp.json();
        } catch (e) {
            toast.error(e.message, {
                position: toast.POSITION.TOP_LEFT
            });
            setLoading(false);
        }
    }, []);

    const getUsersByName = useCallback(async (name) => {
        try {
            setLoading(true);
            const resp = await fetch(`/api/user/name/${name.toLowerCase()}`);
            setLoading(false);
            return await resp.json();
        } catch (e) {
            toast.error(e.message, {
                position: toast.POSITION.TOP_LEFT
            });
            setLoading(false);
        }
    }, []);

    const removeUser = useCallback(async (id) => {
        try {
            setLoading(true);
            const resp = await fetch(`/api/user/${id}`, {
                method: 'DELETE'
            });
            setLoading(false);
            return await resp.json();
        } catch (e) {
            toast.error(e.message, {
                position: toast.POSITION.TOP_LEFT
            });
            setLoading(false);
        }
    }, []);

    const saveUser = useCallback(async (url, method, user) => {
        console.log(user);
        const body = JSON.stringify(user);
        const headers = {
            "Content-Type": 'application/json'
        }
        setLoading(true);
        try {
            const response = await fetch(url,
                {
                    method,
                    body,
                    headers
                }
            );
            setLoading(false);
            console.log(response);
        } catch (e) {
            toast.error(e.message, {
                position: toast.POSITION.TOP_LEFT
            });
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError,
        saveUser, getAllUsers, getUsersByName, removeUser }
}
