import * as tf from '@tensorflow/tfjs';
import Interaction from '../models/Interaction.js';


/**
 * Trains a recommendation model based on user-product interactions.
 * @param {Array} data - Interaction data in the format [{ userId, productId, interactionType }]
 * @returns {tf.Model} - Trained TensorFlow.js model.
 */
export const trainRecommendationModel = (data) => {
  // Step 1: Create user and product indices
  const userIndex = {};
  const productIndex = {};

  let userCounter = 0;
  let productCounter = 0;

  data.forEach(({ userId, productId }) => {
    if (!userIndex[userId]) userIndex[userId] = userCounter++;
    if (!productIndex[productId]) productIndex[productId] = productCounter++;
  });

  const numUsers = userCounter;
  const numProducts = productCounter;

  // Step 2: Prepare input and output tensors
  const userTensor = tf.tensor1d(
    data.map(({ userId }) => userIndex[userId]),
    'int32'
  );

  const productTensor = tf.tensor1d(
    data.map(({ productId }) => productIndex[productId]),
    'int32'
  );

  const interactionTensor = tf.tensor1d(
    data.map(({ interactionType }) => interactionType),
    'float32'
  );

  // Step 3: Define the model
  const userInput = tf.input({ shape: [], dtype: 'int32' });
  const productInput = tf.input({ shape: [], dtype: 'int32' });

  const userEmbedding = tf.layers
    .embedding({ inputDim: numUsers, outputDim: 8 }) // 8-dimensional embedding
    .apply(userInput);

  const productEmbedding = tf.layers
    .embedding({ inputDim: numProducts, outputDim: 8 }) // 8-dimensional embedding
    .apply(productInput);

  const dotProduct = tf.layers.dot({ axes: -1 }).apply([
    userEmbedding,
    productEmbedding,
  ]);

  const output = tf.layers
    .dense({ units: 1, activation: 'sigmoid' }) // Final output score
    .apply(dotProduct);

  const model = tf.model({ inputs: [userInput, productInput], outputs: output });

  // Step 4: Compile the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError',
    metrics: ['mae'], // Mean Absolute Error
  });

  // Step 5: Train the model
  const batchSize = 32;
  const epochs = 10;

  model.fit(
    { user: userTensor, product: productTensor },
    interactionTensor,
    {
      batchSize,
      epochs,
      verbose: 1, // Displays training progress
    }
  );

  // Return the trained model
  return model;
};


export const fetchDataForTraining = async () => {
  const interactions = await Interaction.find({}).populate('product');
  const data = interactions.map(interaction => ({
    userId: interaction.user.toString(),
    productId: interaction.product._id.toString(),
    interactionType: interaction.interactionType,
  }));

  return data;
};

export const recommendProducts = async (userId, model, productIndex) => {
  const userTensor = tf.tensor([userId]);
  const predictions = model.predict(userTensor);

  const predictionScores = predictions.arraySync();
  const recommendedProducts = Object.entries(productIndex).map(([productId, idx]) => ({
    productId,
    score: predictionScores[idx],
  }));

  recommendedProducts.sort((a, b) => b.score - a.score);
  return recommendedProducts.slice(0, 5); // Top 5 recommendations
};
