// import * as tf from '@tensorflow/tfjs';
// import Interaction from '../models/Interaction.js';

// /**
//  * Trains a recommendation model based on user-product interactions.
//  * Includes team and popularity as additional features.
//  * @param {Array} data - Interaction data in the format [{ userId, productId, interactionType, team, popularity }]
//  * @returns {tf.Model} - Trained TensorFlow.js model.
//  */
// export const trainRecommendationModel = (data) => {
//   // Step 1: Create user and product indices
//   const userIndex = {};
//   const productIndex = {};
//   const teamIndex = {};

//   let userCounter = 0;
//   let productCounter = 0;
//   let teamCounter = 0;

//   data.forEach(({ userId, productId, team }) => {
//     if (!userIndex[userId]) userIndex[userId] = userCounter++;
//     if (!productIndex[productId]) productIndex[productId] = productCounter++;
//     if (!teamIndex[team]) teamIndex[team] = teamCounter++;
//   });

//   const numUsers = userCounter;
//   const numProducts = productCounter;
//   const numTeams = teamCounter;

//   // Step 2: Prepare input and output tensors
//   const userTensor = tf.tensor1d(
//     data.map(({ userId }) => userIndex[userId]),
//     'int32'
//   );

//   const productTensor = tf.tensor1d(
//     data.map(({ productId }) => productIndex[productId]),
//     'int32'
//   );

//   const teamTensor = tf.tensor1d(
//     data.map(({ team }) => teamIndex[team]),
//     'int32'
//   );

//   const popularityTensor = tf.tensor2d(
//     data.map(({ popularity }) => [popularity / 100]), // Normalize popularity to 0-1
//     [data.length, 1]
//   );

//   const interactionTensor = tf.tensor1d(
//     data.map(({ interactionType }) => interactionType),
//     'float32'
//   );

//   // Step 3: Define the model
//   const userInput = tf.input({ shape: [], dtype: 'int32' });
//   const productInput = tf.input({ shape: [], dtype: 'int32' });
//   const teamInput = tf.input({ shape: [], dtype: 'int32' });
//   const popularityInput = tf.input({ shape: [1], dtype: 'float32' });

//   const userEmbedding = tf.layers
//     .embedding({ inputDim: numUsers, outputDim: 8 }) // 8-dimensional embedding
//     .apply(userInput);

//   const productEmbedding = tf.layers
//     .embedding({ inputDim: numProducts, outputDim: 8 }) // 8-dimensional embedding
//     .apply(productInput);

//   const teamEmbedding = tf.layers
//     .embedding({ inputDim: numTeams, outputDim: 4 }) // 4-dimensional embedding for teams
//     .apply(teamInput);

//   const concatenatedFeatures = tf.layers.concatenate().apply([
//     userEmbedding,
//     productEmbedding,
//     teamEmbedding,
//     popularityInput,
//   ]);

//   const dense1 = tf.layers
//     .dense({ units: 16, activation: 'relu' })
//     .apply(concatenatedFeatures);

//   const output = tf.layers
//     .dense({ units: 1, activation: 'sigmoid' }) // Final output score
//     .apply(dense1);

//   const model = tf.model({
//     inputs: [userInput, productInput, teamInput, popularityInput],
//     outputs: output,
//   });

//   // Step 4: Compile the model
//   model.compile({
//     optimizer: tf.train.adam(),
//     loss: 'meanSquaredError',
//     metrics: ['mae'], // Mean Absolute Error
//   });

//   // Step 5: Train the model
//   const batchSize = 32;
//   const epochs = 10;

//   model.fit(
//     { 
//       user: userTensor, 
//       product: productTensor, 
//       team: teamTensor, 
//       popularity: popularityTensor 
//     },
//     interactionTensor,
//     {
//       batchSize,
//       epochs,
//       verbose: 1, // Displays training progress
//     }
//   );

//   // Return the trained model
//   return model;
// };

// /**
//  * Fetches interaction data for training.
//  * Includes team and popularity information for products.
//  */
// export const fetchDataForTraining = async () => {
//   const interactions = await Interaction.find({}).populate('product');
//   const data = interactions
//     .filter((interaction) => interaction.product) // Ensure product data is populated
//     .map((interaction) => ({
//       userId: interaction.user.toString(),
//       productId: interaction.product._id.toString(),
//       interactionType:
//         interaction.interactionType === 'like'
//           ? 1
//           : interaction.interactionType === 'purchase'
//           ? 2
//           : 0, // Assign numeric values to interaction types
//       team: interaction.product.team,
//       popularity: interaction.product.popularity,
//     }));

//   return data;
// };

// /**
//  * Recommends products based on user ID and the trained model.
//  * Includes popularity and team in predictions.
//  */
// export const recommendProducts = async (userId, model, productIndex, products) => {
//   const userTensor = tf.tensor1d([userId], 'int32');
//   const productTensors = tf.tensor1d(
//     products.map((product) => productIndex[product._id]),
//     'int32'
//   );
//   const teamTensors = tf.tensor1d(
//     products.map((product) => teamIndex[product.team]),
//     'int32'
//   );
//   const popularityTensor = tf.tensor2d(
//     products.map((product) => [product.popularity / 100]), // Normalize popularity
//     [products.length, 1]
//   );

//   const predictions = model.predict([
//     userTensor.tile([products.length]),
//     productTensors,
//     teamTensors,
//     popularityTensor,
//   ]);

//   const predictionScores = predictions.arraySync();
//   const recommendedProducts = products.map((product, idx) => ({
//     productId: product._id,
//     name: product.name,
//     team: product.team,
//     popularity: product.popularity,
//     score: predictionScores[idx],
//   }));

//   recommendedProducts.sort((a, b) => b.score - a.score);
//   return recommendedProducts.slice(0, 5); // Top 5 recommendations
// };
