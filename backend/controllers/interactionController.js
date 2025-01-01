import { fetchDataForTraining, recommendProducts, trainRecommendationModel } from '../services/recommendationService.js';
import Interaction from '../models/Interaction.js';

// Log a new interaction
const logInteraction = async (req, res) => {
  const { productId, interactionType } = req.body;

  if (!['view', 'like', 'purchase'].includes(interactionType)) {
    return res.status(400).json({ message: 'Invalid interaction type' });
  }

  try {
    const interaction = new Interaction({
      user: req.user._id, // The authenticated user
      product: productId,
      interactionType,
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
    const data = await fetchDataForTraining();
    const model = trainRecommendationModel(data);

    const productIndex = data.reduce((index, item, idx) => {
      index[item.productId] = idx;
      return index;
    }, {});

    const recommendations = await recommendProducts(req.user._id, model, productIndex);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations', error });
  }
};



export { logInteraction, getUserInteractions, getRecommendations };
