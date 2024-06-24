import React, { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";

const LOGOUT_URL = proccess.env.LOGOUT_URL;


const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Current Auth State:", auth); 
    }, [auth]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("Auth Token:", auth?.token); 
            await axios.post(LOGOUT_URL, {}, {
                headers: { 
                    'Content-Type': 'application/json',
            },
                withCredentials: true
            });

            setAuth(null);
            navigate('/login');
        } catch (err) {
            console.error('Failed to logout', err);
        }
    }

    const isLoggedin = !!auth?.email;


    return (
        
        <div className='flex items-center bg-indigo-500 p-3'>
            {isLoggedin ? (
                <div className="flex md:flex-row flex-col gap-2 justify-between w-full items-center">
                    <Link to='/'>
                        <div className="text-2xl text-white font-thin">MJManagement</div>
                    </Link>
                    <div className="flex text-white uppercase md:text-sm text-xs">
                        <div>Bem-vindo, <span className="font-bold">{auth.name}</span></div>
                        &nbsp;/&nbsp;
                        <Link to='/'>
                            <div>Meus Anúncios</div>
                        </Link>
                        &nbsp;/&nbsp;
                        <button onClick={handleLogout} className="bg-indigo-500 text-white border-0 uppercase">
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <Link to='/'>
                    <div className="text-2xl text-white font-thin w-full text-center">MJManagement</div>
                </Link>
            )}
        </div>
    )
}

export default Header