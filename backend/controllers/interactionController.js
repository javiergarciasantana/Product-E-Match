//import { fetchDataForTraining, recommendProducts, trainRecommendationModel } from '../services/recommendationService.js';
import Interaction from '../models/Interaction.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

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

// Generate product recommendations for the authenticated user
const getRecommendations = async (req, res) => {
  // try {
  //   // Fetch interaction data for training
  //   const data = await fetchDataForTraining();
  //   const model = trainRecommendationModel(data);

  //   // Build the product index mapping productId to model indices
  //   const productIndex = data.reduce((index, item, idx) => {
  //     index[item.productId] = idx;
  //     return index;
  //   }, {});

  //   // Get recommendations for the user
  //   const recommendations = await recommendProducts(req.user._id, model, productIndex);
  //   res.status(200).json(recommendations);
  // } catch (error) {
  //   console.error('Error generating recommendations:', error);
  //   res.status(500).json({ message: 'Error generating recommendations', error });
  // }
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
