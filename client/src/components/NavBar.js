import React from 'react';
import {Link} from "react-router-dom";

export default function NavBar() {
    return (
        <ul className="nav bg-light">
            <li className="nav-item">
                <Link
                    className="nav-link"
                    aria-current="page"
                    to="/create"
                >Create</Link>
            </li>
            <li className="nav-item">
                <Link
                    className="nav-link"
                    to="/list"
                >List</Link>
            </li>
            <li className="nav-item">
                <Link
                    className="nav-link"
                    to="/search"
                >Search</Link>
            </li>
        </ul>
    )
}
