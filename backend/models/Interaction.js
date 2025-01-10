import mongoose from 'mongoose';

const interactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    interactionType: {
      type: String,
      enum: ['view', 'like', 'purchase'], // Define the types of interactions
      required: true,
    },
    team: {
      type: String, // Name of the team associated with the product
      required: true,
    },
    popularity: {
      type: Number, // Popularity score of the product
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
