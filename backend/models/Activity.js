const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', ActivitySchema);
