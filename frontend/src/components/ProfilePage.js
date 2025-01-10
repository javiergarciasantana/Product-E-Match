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
        const response = await axios.get('/api/interactions/user-interactions');
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

  if (loading) {
    return <p>Loading interactions...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
    <Header/>
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
                <p>
                  <strong>Popularity:</strong>{' '}
                  <span className="popularity">{product.popularity}</span>
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
