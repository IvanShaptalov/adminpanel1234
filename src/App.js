import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import TasksPage from './TasksPage';
import UsersPage from './UsersPage';
import CommunityPage from './CommunityPage';
import './App.css'; // Файл для стилей
import axios from 'axios';
import { BACKEND_SERVER_URL } from './config';
import DailyTasksPage from "./DailyTasksPage";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state
    const token = localStorage.getItem('admin_token'); // Assuming you use 'admin_token'

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsAuthenticated(false); // No token found
                return;
            }

            try {
                // Make an API request to verify the token
                const response = await axios.get(`${BACKEND_SERVER_URL}/admin/tasks/all?limit=1`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // If the request is successful, the token is valid
                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                setIsAuthenticated(false); // Token is invalid or expired
            }
        };

        verifyToken();
    }, [token]);

    if (isAuthenticated === null) {
        // Show loading state or spinner while token is being verified
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <nav className="sidebar">
                    <ul>
                        <li>
                            <Link to="/admin/users">users</Link>
                        </li>
                        <li>
                            <Link to="/admin/daily-tasks">daily tasks</Link>
                        </li>
                        <li>
                            <Link to="/admin/community-tasks">community tasks</Link>
                        </li>
                        <li>
                            <Link to="/admin/community">community</Link>
                        </li>
                    </ul>
                </nav>
                <div className="content">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute>
                                    <UsersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/daily-tasks"
                            element={
                                <ProtectedRoute>
                                    <DailyTasksPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/community-tasks"
                            element={
                                <ProtectedRoute>
                                    <TasksPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/community"
                            element={
                                <ProtectedRoute>
                                    <CommunityPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
