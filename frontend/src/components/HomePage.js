import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import '../styles/home.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('/api/products/getall');
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  const handleLike = async (productId) => {
    try {
      await axios.post('/api/interactions/log', {
        productId,
        interactionType: "like",
      });
      alert('Product liked successfully!');
    } catch (error) {
      console.error('Error liking product:', error);
      alert('Failed to like product.');
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="products-section">
        <h2>All Products</h2>
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.image || 'default-image.jpg'}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p><strong>Team:</strong> {product.team}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <button
                className="like-button"
                onClick={() => handleLike(product._id)}
              >
                ❤️ Like
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
