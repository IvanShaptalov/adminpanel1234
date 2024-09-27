import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { BACKEND_SERVER_URL } from "./config";
import './CommunityPage.css';

const CommunityPage = () => {
    const [communities, setCommunities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [communityPointsInputs, setCommunityPointsInputs] = useState({});
    const [botCountInputs, setBotCountInputs] = useState({});
    const [newCommunity, setNewCommunity] = useState({
        id: '',
        title: '',
        community_points: '',
        creator_id: '',
        is_banned: false,
        members: 1
    }); // New state for community creation form

    // Получение данных сообществ
    useEffect(() => {
        const fetchCommunities = async () => {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                console.error('No admin token found');
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "search_text": searchTerm,
                "limit": 200,
                "is_banned": null
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            try {
                const response = await fetch(`${BACKEND_SERVER_URL}/community/find`, requestOptions);
                if (!response.ok) {
                    console.error('Error fetching communities:', response.statusText);
                    return;
                }
                const result = await response.json();
                setCommunities(result.communities || []);
            } catch (error) {
                console.error('Error fetching communities:', error);
            }
        };

        fetchCommunities();
    }, [searchTerm]);

    // Функция для создания нового сообщества
    const createCommunity = async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            console.error('No admin token found');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(newCommunity);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/community/create`, requestOptions);
            if (!response.ok) {
                console.error('Error creating community:', response.statusText);
                return;
            }
            const result = await response.json();
            setCommunities([...communities, result]);
            setNewCommunity({
                id: '',
                title: '',
                community_points: '',
                creator_id: '',
                is_banned: false,
                members: 1
            }); // Reset the form after creation
            console.log('Community created successfully');
        } catch (error) {
            console.error('Error creating community:', error);
        }
    };

    // Bot generation
    const generateBots = async (communityId, membersCount) => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            console.error('No admin token found');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "community_id": communityId,
            "members_count": membersCount
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/community/bots/generate`, requestOptions);
            if (!response.ok) {
                console.error('Error generating bots:', response.statusText);
                return;
            }
            console.log('Bots generated successfully');

            // Update the members count in the community
            setCommunities((prevCommunities) =>
                prevCommunities.map((community) =>
                    community.id === communityId
                        ? { ...community, members: community.members + membersCount }
                        : community
                )
            );
        } catch (error) {
            console.error('Error generating bots:', error);
        }
    };

    // Bot removal
    const removeBots = async (communityId, membersCount) => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            console.error('No admin token found');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "community_id": communityId,
            "members_count": membersCount
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/community/bots/remove`, requestOptions);
            if (!response.ok) {
                console.error('Error removing bots:', response.statusText);
                return;
            }
            console.log('Bots removed successfully');

            // Update the members count in the community
            setCommunities((prevCommunities) =>
                prevCommunities.map((community) =>
                    community.id === communityId
                        ? { ...community, members: Math.max(0, community.members - membersCount) } // Ensuring members count doesn't go below 0
                        : community
                )
            );
        } catch (error) {
            console.error('Error removing bots:', error);
        }
    };

    // Функция для блокировки/разблокировки сообщества
    const toggleBanned = async (communityId, isBanned) => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            console.error('No admin token found');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "id": communityId
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const url = isBanned ? `${BACKEND_SERVER_URL}/community/unblock` : `${BACKEND_SERVER_URL}/community/block`;

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error('Error changing ban status:', response.statusText);
                return;
            }
            const updatedCommunities = communities.map(community =>
                community.id === communityId ? { ...community, is_banned: !community.is_banned } : community
            );
            setCommunities(updatedCommunities);
        } catch (error) {
            console.error('Error updating ban status:', error);
        }
    };

    // Функция для изменения очков сообщества
    const editCommunityPoints = async (communityId, communityPoints) => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            console.error('No admin token found');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "community_points": communityPoints,
            "community_id": communityId
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/community/points/edit`, requestOptions);
            if (!response.ok) {
                console.error('Error editing community points:', response.statusText);
                return;
            }

            // Обновляем состояние после успешного обновления очков
            setCommunities((prevCommunities) =>
                prevCommunities.map((community) =>
                    community.id === communityId ? { ...community, community_points: communityPoints } : community
                )
            );

            console.log('Community points updated successfully');
        } catch (error) {
            console.error('Error editing community points:', error);
        }
    };

    // Функция для удаления сообщества
    const deleteCommunity = async (communityId) => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            console.error('No admin token found');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "id": communityId
        });

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${BACKEND_SERVER_URL}/community/remove`, requestOptions);
            if (!response.ok) {
                console.error('Error deleting community:', response.statusText);
                return;
            }

            // Удаляем сообщество из состояния после успешного удаления
            setCommunities((prevCommunities) =>
                prevCommunities.filter((community) => community.id !== communityId)
            );

            console.log('Community deleted successfully');
        } catch (error) {
            console.error('Error deleting community:', error);
        }
    };

    // Обработка изменения значений для количества ботов
    const handleBotCountChange = (communityId, value) => {
        setBotCountInputs({
            ...botCountInputs,
            [communityId]: Math.max(0, value) // Set a minimum value of 0
        });
    };

    // Обработка изменения значений очков
    const handleInputChange = (communityId, value) => {
        setCommunityPointsInputs({
            ...communityPointsInputs,
            [communityId]: value
        });
    };

    // Обработка изменений в форме создания сообщества
    const handleNewCommunityChange = (field, value) => {
        setNewCommunity({ ...newCommunity, [field]: value });
    };

    return (
        <div className="community-page">
            <h2>Communities</h2>

            {/* Form for creating a new community */}
            <div className="create-community-form">
                <h3>Create New Community</h3>
                <input
                    type="text"
                    placeholder="Community ID"
                    value={newCommunity.id}
                    onChange={(e) => handleNewCommunityChange('id', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={newCommunity.title}
                    onChange={(e) => handleNewCommunityChange('title', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Community Points"
                    value={newCommunity.community_points}
                    onChange={(e) => handleNewCommunityChange('community_points', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Creator ID"
                    value={newCommunity.creator_id}
                    onChange={(e) => handleNewCommunityChange('creator_id', e.target.value)}
                />
                <button onClick={createCommunity}>Create Community</button>
            </div>

            <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <table className="communities-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Community Points</th>
                    <th>Creator ID</th>
                    <th>Members</th>
                    <th>Banned</th>
                    <th>Edit Points</th>
                    <th>Bots</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {communities.map((community) => (
                    <tr key={community.id}>
                        <td>{community.id}</td>
                        <td>{community.title}</td>
                        <td>{community.community_points}</td>
                        <td>{community.creator_id}</td>
                        <td>{community.members}</td>
                        <td>
                            <Switch
                                onChange={() => toggleBanned(community.id, community.is_banned)}
                                checked={community.is_banned}
                                offColor="#0f0"
                                onColor="#f00"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={communityPointsInputs[community.id] || ''}
                                onChange={(e) => handleInputChange(community.id, e.target.value)}
                                placeholder="Enter new points"
                            />
                            <button onClick={() => editCommunityPoints(community.id, Number(communityPointsInputs[community.id]))}>
                                Update
                            </button>
                        </td>
                        <td>
                            <input
                                type="number"
                                min="0"
                                value={botCountInputs[community.id] || 0}
                                onChange={(e) => handleBotCountChange(community.id, e.target.value)}
                                placeholder="Bot count"
                            />
                            <button onClick={() => generateBots(community.id, Number(botCountInputs[community.id]))}>
                                Generate Bots
                            </button>
                            <button onClick={() => removeBots(community.id, Number(botCountInputs[community.id]))}>
                                Remove Bots
                            </button>
                        </td>
                        <td>
                            <button onClick={() => deleteCommunity(community.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CommunityPage;
