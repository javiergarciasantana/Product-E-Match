import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';

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
    <div>
      <Header />
      <h2>All Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <h3>{product.name}</h3>
            <p>Team: {product.team}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
