import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            const response = await axios.post('/api/login', { username, password });
            const token = response.data.token; // Assuming your backend returns a token

            // Store the token (e.g., in localStorage)
            localStorage.setItem('token', token);

            // Redirect to the chat page (using useNavigate)
            navigate('/chat'); // Replace '/chat' with your actual chat route

        } catch (err) {
            console.error("Login error:", err);

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Display error message from backend
            } else if (err.response && err.response.data) {
                setError(err.response.data); // Display error message from backend
            }
            else {
                setError('Invalid username or password.'); // Generic error message
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;