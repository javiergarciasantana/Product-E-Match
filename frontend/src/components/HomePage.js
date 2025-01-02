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

  return (
    <div className="home-container">
      <Header />
      <div className="products-section">
        <h2>All Products</h2>
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <h3>{product.name}</h3>
              <p><strong>Team:</strong> {product.team}</p>
              <p><strong>Price:</strong> ${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
