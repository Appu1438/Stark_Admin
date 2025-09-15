
import React, { useContext, useState } from 'react';
import './login.css';
import { AuthContext } from '../../context/authContext/AuthContext';
import { login } from '../../context/authContext/apiCalls';
import { toast } from 'react-toastify';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isFetching, dispatch } = useContext(AuthContext);

    const getClientIp = async () => {
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            const data = await res.json();
            return data.ip;
        } catch (err) {
            try {
                const res = await fetch("https://ifconfig.me/all.json");
                const data = await res.json();
                return data.ip_addr; // different field name
            } catch (err2) {
                console.error("Failed to get IP:", err2);
                return null;
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const ip = await getClientIp(); // ⬅️ Your custom IP fetch function
            if (!ip) {
                toast.error("Unable to fetch IP address.");
                return;
            }

            // Call login API with IP included
            login({ email, password, ip }, dispatch, toast);
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };


    return (
        <div className="login">
            <div className="loginContainer">
                <h2 className="loginTitle">Welcome Back</h2>
                <form className="loginForm">
                    <input
                        type="email"
                        placeholder="Email"
                        className="loginInput"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="loginInput"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="loginButton"
                        onClick={handleLogin}
                        disabled={isFetching}
                    >
                        Login
                    </button>
                    <p className="forgotPassword">Forgot your password?</p>
                </form>
            </div>
        </div>
    );
}
