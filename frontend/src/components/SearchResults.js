// SearchResults.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import "../styles/searchResults.css";

// Utility to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const query = useQuery().get("query");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim() === "") {
        setErrorMessage("Please provide a valid search query.");
        setResults([]);
        return;
      }

      try {
        const response = await axios.get(`/api/products/search?query=${query}`);
        setResults(response.data);
        setErrorMessage(""); // Clear any previous error messages
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage("No products found matching your query.");
          setResults([]); // Clear previous results
        } else {
          console.error("An unexpected error occurred:", error);
          setErrorMessage("An unexpected error occurred. Please try again later.");
        }
      }
    };

    fetchResults();
  }, [query]);

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
    <div className="search-results">
      <Header />
      <h2>Search Results for "{query}"</h2>

      {/* Display error message if it exists */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="product-list">
        {results.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={product.image || "default-image.jpg"}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>
              <strong>Team:</strong> {product.team}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
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
  );
};

export default SearchResults;
