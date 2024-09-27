import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { BACKEND_SERVER_URL } from "./config";

const UsersPage = () => {
    const [users, setUsers] = useState([]); // Хранение данных пользователей
    const [searchTerm, setSearchTerm] = useState(''); // Хранение значения поискового запроса
    const [soloPointsInputs, setSoloPointsInputs] = useState({}); // Хранение значений для редактирования solo points

    // Функция для получения данных с сервера
    useEffect(() => {
        const fetchUsers = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem('admin_token')}`); // Замените на актуальный токен
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "search_text": searchTerm, // Используем searchTerm для поиска
                "limit": 200,
                "is_banned": null
            });

            const requestOptions = {
                method: "POST", // Используем метод POST
                headers: myHeaders,
                body: raw, // Тело запроса
                redirect: "follow"
            };

            try {
                const response = await fetch(`${BACKEND_SERVER_URL}/admin/find/user`, requestOptions);
                const result = await response.json();
                setUsers(result.users || []); // Предположим, что массив пользователей возвращается в поле 'users'
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [searchTerm]); // Добавляем зависимость от searchTerm

    // Функция для переключения статуса banned
    const toggleBanned = async (id, isBanned) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('admin_token')}`); // Замените на актуальный токен
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "user_id": id,
            "is_banned": !isBanned
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/admin/user/block/edit`, requestOptions);
            const result = await response.json();
            console.log('Ban status updated:', result);

            // Обновление локального состояния пользователей
            const updatedUsers = users.map((user) => {
                if (user.id === id) {
                    return { ...user, is_banned: !user.is_banned }; // Инвертируем значение is_banned
                }
                return user;
            });
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error updating ban status:', error);
        }
    };

    // Функция для редактирования solo points
    const editSoloPoints = async (id, soloPoints) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('admin_token')}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "user_id": id,
            "operand": "=",
            "solo_points": soloPoints
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/admin/user/solo_points/edit`, requestOptions);
            const result = await response.json();
            console.log('Solo points updated:', result);

            // Обновление локального состояния пользователей
            const updatedUsers = users.map((user) => {
                if (user.id === id) {
                    return { ...user, solo_points: soloPoints }; // Обновляем значение solo_points
                }
                return user;
            });
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error updating solo points:', error);
        }
    };

    // Функция для удаления пользователя
    const deleteUser = async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('admin_token')}`); // Замените на актуальный токен

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/admin/user/remove/${id}`, requestOptions);
            const result = await response.text();
            console.log('User deleted:', result);

            // Удаление пользователя из локального состояния
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Обновление значений input для solo points
    const handleInputChange = (id, value) => {
        setSoloPointsInputs({
            ...soloPointsInputs,
            [id]: value
        });
    };

    return (
        <div className="users-page">
            <h2>Users</h2>
            <input
                type="text"
                placeholder="Search by nickname..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <table className="users-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Nickname</th>
                    <th>Solo Points</th>
                    <th>Community ID</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Telegram tag</th>
                    <th>Banned</th>
                    <th>Telegram id</th>
                    <th>Last Login</th>
                    <th>Language</th>
                    <th>Edit Solo Points</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nickname}</td>
                        <td>{user.solo_points}</td>
                        <td>{user.community_id || user.owned_community_id}</td>
                        <td>{user.phone}</td>
                        <td>{user.primary_mail}</td>
                        <td>{user.telegram_tag}</td>
                        <td>
                            <Switch
                                onChange={() => toggleBanned(user.id, user.is_banned)}
                                checked={user.is_banned}
                                onColor="#f00"
                                offColor="#0f0"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                        </td>
                        <td>{user.tg_id}</td>
                        <td>todo 🫵🫠</td>
                        <td>todo 🫵🫠</td>
                        <td>
                            <input
                                type="number"
                                value={soloPointsInputs[user.id] || ''}
                                onChange={(e) => handleInputChange(user.id, e.target.value)}
                                placeholder="Enter new solo points"
                            />
                            <button onClick={() => editSoloPoints(user.id, Number(soloPointsInputs[user.id]))}>
                                Update
                            </button>
                        </td>
                        <td>
                            <button onClick={() => deleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
