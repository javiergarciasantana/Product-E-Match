import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import '../styles/home.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/getall');
        const sortedProducts = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Fetch recommended products for the user
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/interactions/recommendations');
        setRecommendedProducts(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchProducts();
    fetchRecommendations();
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
    <div>
      <Header />
      <div className="home-container">
        {/* Recommended Products Section */}
        <div className="recommended-section">
          <h2>Recommended for You</h2>
          <div className="product-list">
            {recommendedProducts.length > 0 ? (
              recommendedProducts.map((product) => (
                <div className="product-card" key={product._id}>
                  <img
                    src={product.image || 'default-image.jpg'}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                  <p><strong>Team:</strong> {product.team}</p>
                  <p><strong>Popularity:</strong> {product.popularity}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <button
                    className="like-button"
                    onClick={() => handleLike(product._id)}
                  >
                    ❤️ Like
                  </button>
                </div>
              ))
            ) : (
              <p>No recommendations available at the moment.</p>
            )}
          </div>
        </div>

        {/* All Products Section */}
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
    </div>
  );
};

export default HomePage;
