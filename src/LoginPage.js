import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_SERVER_URL } from './config'; // Import the constant

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // Новый state для OTP
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${BACKEND_SERVER_URL}/admin/login`, {
                name: username,
                password: password,
                otp: otp
            });

            // If login is successful, save the admin token
            const token = response.data.access_token;

            localStorage.setItem('admin_token', token); // Save the admin token
            navigate('/admin/users'); // Redirect to the admin users page
        } catch (error) {
            console.error('Login error:', error);
            alert('Неверные учетные данные или OTP');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
