import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import '../styles/home.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Función para obtener todos los productos
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

    // Función para obtener las recomendaciones
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/interactions/recommendations', {
          withCredentials: true,
        });
        console.log('Data from API:', response.data);
        setRecommendedProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchProducts();
    fetchRecommendations();
  }, []);

  const handleLike = async (productId) => {
    try {
      // Registrar interacción de "like"
      await axios.post(
        '/api/interactions/log',
        {
          productId,
          interactionType: "like",
        },
        {
          withCredentials: true,
        }
      );
      //alert('Product liked successfully!');

      // Obtener productos actualizados
      const updatedProducts = await axios.get('/api/products/getall');
      const sortedProducts = updatedProducts.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setProducts(sortedProducts);

      // Obtener recomendaciones actualizadas
      const updatedRecommendations = await axios.get(
        '/api/interactions/recommendations',
        { withCredentials: true }
      );
      setRecommendedProducts(updatedRecommendations.data || []);
    } catch (error) {
      console.error('Error liking product:', error);
      alert('Failed to like product.');
    }
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        {/* Sección de Productos Recomendados */}
        <div className="recommended-section">
          <h2>Recommended for You</h2>
          <div className="product-list">
            {console.log('Rendering recommended products:', recommendedProducts)}
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

        {/* Sección de Todos los Productos */}
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
