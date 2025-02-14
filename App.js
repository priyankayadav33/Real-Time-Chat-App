import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

const App = () => {
    const isAuthenticated = () => {
        // Check if a token exists in localStorage (or your chosen storage)
        const token = localStorage.getItem('token');
        return !!token; // Returns true if token exists, false otherwise
    };

    const PrivateRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                } />
                <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login by default */}
            </Routes>
        </Router>
    );
};

export default App;