import fetch from 'node-fetch';
import natural from 'natural';

const TfIdf = natural.TfIdf;

/**
 * Fetch data from an external API.
 * @param {string} apiUrl - The URL of the API to fetch data from.
 * @returns {Array} The fetched data.
 */
async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        return data; // Returns an array of objects
    } catch (error) {
        console.error("Error fetching data:", error.message);
        throw new Error("Failed to fetch data from API");
    }
}

/**
 * Generate recommendations based on product names.
 * @param {Array} data - The input data array.
 * @param {string} targetName - The name of the product to find recommendations for.
 * @returns {Array} A list of recommended products.
 */
function generateRecommendations(data, targetName) {
    const tfidf = new TfIdf();

    // Add all product names to the TF-IDF model
    data.forEach(item => tfidf.addDocument(item.name));

    // Compute similarity scores with the target name
    const recommendations = data.map((item, index) => {
        const similarity = tfidf.tfidf(targetName, index);
        return { ...item, similarity };
    });

    // Sort products by similarity in descending order, excluding the target product
    return recommendations
        .filter(item => item.name !== targetName)
        .filter((product) => product.similarity > 7)
        .sort((a, b) => b.similarity - a.similarity)
        //.slice(0, 5); // Return the top 5 recommendations
}

/**
 * Main function to fetch data and generate recommendations.
 * @param {string} apiUrl - The URL of the API to fetch data from.
 * @param {string} targetName - The name of the product to find recommendations for.
 * @returns {Array} The recommended products.
 */
async function suggestRecommendations(apiUrl, targetName) {
    const data = await fetchData(apiUrl);

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("API returned invalid data or no data available");
    }

    return generateRecommendations(data, targetName);
}

// Export the main function
export default suggestRecommendations;
