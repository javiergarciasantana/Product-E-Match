import Interaction from '../models/Interaction.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import suggestRecommendations from '../services/recommendationService.js';

// Log a new interaction
const logInteraction = async (req, res) => {
  const { productId, interactionType } = req.body;

  if (!['view', 'like', 'purchase'].includes(interactionType)) {
    return res.status(400).json({ message: 'Invalid interaction type' });
  }

  try {
    // Fetch the product to get additional data (team and popularity)
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const interaction = new Interaction({
      user: req.user._id, // The authenticated user
      product: productId,
      interactionType,
      team: product.team, // Get the team from the Product model
      popularity: product.popularity, // Get the popularity from the Product model
    });

    await interaction.save();

    res.status(201).json({ message: 'Interaction logged successfully' });
  } catch (error) {
    console.error('Error logging interaction:', error);
    res.status(500).json({ message: 'Error logging interaction', error });
  }
};

// Fetch all interactions for the authenticated user
const getUserInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.find({ user: req.user._id }).populate('product');

    if (!interactions.length) {
      return res.status(404).json({ message: 'No interactions found for this user' });
    }

    res.status(200).json(interactions);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ message: 'Error fetching interactions', error });
  }
};

const getRecommendations = async (req, res) => {
  try {
    console.log('Solicitud recibida para recomendaciones del usuario:', req.user);

    // Paso 1: Obtener los productos a los que el usuario ha dado "like"
    const likedInteractions = await Interaction.find({
      user: req.user._id,
      interactionType: 'like',
    }).populate('product');

    if (!likedInteractions.length) {
      return res.status(404).json({ message: 'No likes found to generate recommendations' });
    }

    // Paso 2: Inicializar una lista para almacenar todas las recomendaciones
    let allRecommendations = [];

    // Iterar sobre los productos "like" y llamar a suggestRecommendations para cada uno
    for (const interaction of likedInteractions) {
      const productName = interaction.product.name;

      console.log(`Generating recommendations for liked product: ${productName}`);

      const recommendations = await suggestRecommendations(
        "http://localhost:3000/api/products/getall",
        productName
      );

      // Agregar las recomendaciones obtenidas a la lista
      allRecommendations = allRecommendations.concat(recommendations);
    }

    // Paso 3: Filtrar recomendaciones con similitud mayor a 4
    const filteredRecommendations = allRecommendations
    .map((product) => ({
      name: product.name, // Asegúrate de que estos datos existan en el objeto `product`
      team: product.team,
      price: product.price,
      image: product.image,
      similarity: product.similarity,
    }))
    .sort((a, b) => b.similarity - a.similarity); // Ordenar por similitud descendente


    if (!filteredRecommendations.length) {
      return res.status(404).json({ message: 'No recommendations match the similarity threshold' });
    }

    res.status(200).json(filteredRecommendations);
    //imprimir recomendaciones proporcionadas
    console.log('recommendations:', filteredRecommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations', error });
  }
};


// Eliminar una interacción
const deleteInteraction = async (req, res) => {
  try {
    console.log('Request params ID:', req.params.id); // Log del ID recibido

    // Validar el formato del ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid interaction ID');
      return res.status(400).json({ message: 'Invalid interaction ID' });
    }

    // Buscar la interacción
    const interaction = await Interaction.findById(req.params.id);
    console.log('Interaction found:', interaction); // Log de la interacción encontrada

    if (!interaction) {
      console.log('Interaction not found');
      return res.status(404).json({ message: 'Interaction not found' });
    }

    // Verificar que el usuario sea el propietario
    if (interaction.user.toString() !== req.user._id.toString()) {
      console.log('User not authorized to delete this interaction');
      return res.status(403).json({ message: 'Not authorized to delete this interaction' });
    }

    // Eliminar la interacción usando deleteOne()
    await interaction.deleteOne();
    console.log('Interaction deleted successfully');
    res.status(200).json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting interaction:', error); // Log del error
    res.status(500).json({ message: 'Error deleting interaction', error });
  }
};


export { logInteraction, getUserInteractions, getRecommendations, deleteInteraction };
