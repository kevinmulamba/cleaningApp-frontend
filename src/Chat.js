import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connexion au serveur backend (mets l’URL si nécessaire)
const socket = io(process.env.REACT_APP_API_URL);

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // Écoute des messages entrants
    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.off('receive-message');
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() === '') return;

    const messageData = {
      senderId: userId,
      text: messageInput,
      timestamp: new Date().toISOString(),
    };

    // Envoie du message au serveur
    socket.emit('send-message', messageData);

    // Affiche le message instantanément côté utilisateur
    setMessages((prev) => [...prev, messageData]);
    setMessageInput('');
  };

  return (
    <div className="p-4 border rounded-xl shadow-lg bg-white max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">💬 Chat en direct</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-4 rounded bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong className={msg.senderId === userId ? 'text-blue-600' : 'text-green-600'}>
              {msg.senderId === userId ? 'Vous' : 'Autre'}:
            </strong>{' '}
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Tapez un message..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;

