import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import '../styles/profile.css';

const ProfilePage = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await axios.get('/api/interactions/user-interactions', {
          withCredentials: true, // Asegura que se envíen las cookies
        });
        setInteractions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching interactions:', err);
        setError('No interactions yet!.');
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  const handleDelete = async (interactionId) => {
    try {
      await axios.delete(`/api/interactions/user-interactions/${interactionId}`, {
        withCredentials: true, // Asegura que se envíen las cookies
      });

      // Actualizar la lista de interacciones después de eliminar
      setInteractions(interactions.filter((interaction) => interaction._id !== interactionId));
    } catch (err) {
      console.error('Error deleting interaction:', err);
      alert('Failed to delete interaction.');
    }
  };

  if (loading) {
    return <p>Loading interactions...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h1>Your Interactions</h1>
        {interactions.length === 0 ? (
          <p>No interactions found.</p>
        ) : (
          <div className="interaction-list">
            {interactions.map((interaction) => {
              const { product } = interaction;
              if (!product) {
                // Skip interactions without a valid product
                return null;
              }

              return (
                <div className="interaction-card" key={interaction._id}>
                  <img
                    src={product.image || 'default-image.jpg'}
                    alt={product.name || 'Product Image'}
                    className="interaction-product-image"
                  />
                  <h3>{product.name}</h3>
                  <p>
                    <strong>Team:</strong> {product.team}
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  {product.popularity > 80 && (
                    <div className="popular-badge">🔥 Popular</div>
                  )}
                  <p>
                    <strong>Interaction Type:</strong> {interaction.interactionType}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(interaction.timestamp).toLocaleDateString()}
                  </p>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(interaction._id)}
                  >
                    Delete Like
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
