import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null); // Store logged-in user info
    const [room, setRoom] = useState('general'); // Default room
    const messageListRef = useRef(null); // Ref for scrolling

    useEffect(() => {
        // 1. Check for user authentication (e.g., JWT in localStorage)
        const token = localStorage.getItem('token'); // Or however you store your token
        if (token) {
            // Fetch user data if needed
            axios.get('/api/users/me', { // Example endpoint
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => setUser(res.data))
                .catch(err => console.error("Error fetching user:", err));


            // 2. Establish Socket.io connection (only if user is logged in)
            const socket = io(); // Connects to your backend

            // 3. Join the room
            socket.emit('join_room', room);

            // 4. Listen for new messages
            socket.on('message', (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });

            // 5. Cleanup on unmount
            return () => {
                socket.disconnect();
            };
        } else {
            // Redirect to login or show a message
            console.log("User not authenticated. Redirecting to login...");
            // Example: window.location.href = '/login';
        }
    }, [room]); // Re-run effect when the room changes

    useEffect(() => {
        // Scroll to bottom when messages change
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (newMessage.trim() !== "" && user) {
            const message = {
                content: newMessage.trim(),
                sender: user._id, // Or username, depending on your setup
                room: room,
            };

            // 1. Emit the message to the server
            io().emit('send_message', message);  // Use the existing socket

            // 2. Update the local state immediately (for a better user experience)
            setMessages(prevMessages => [...prevMessages, message]);
            setNewMessage('');

            // 3. (Optional) Send message to backend to store in DB
            axios.post('/api/messages', message, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).catch(err => console.error("Error saving message:", err));
        }
    };

    return (
        <div>
            {user ? ( // Only render chat if user is logged in
                <div>
                    <h2>Chat Room: {room}</h2>
                    <div className="message-list" ref={messageListRef}>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <span className="message-sender">
                                    {msg.sender === user._id ? "You" : msg.sender} : {/* Display sender info */}
                                </span>
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            ) : (
                <p>Please log in to chat.</p>
            )}
        </div>
    );
};

export default Chat;