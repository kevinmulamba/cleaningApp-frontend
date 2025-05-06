// src/components/PostServiceSuggestions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostServiceSuggestions = ({ userId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.post('/api/suggestions', { userId });
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des suggestions :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId]);

  if (loading) return <div>Chargement des suggestions...</div>;

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">🧠 Suggestions personnalisées</h3>
      <ul className="list-disc pl-6 space-y-2">
        {suggestions.map((sugg, index) => (
          <li key={index}>{sugg}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostServiceSuggestions;

