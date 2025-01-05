import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the jersey
  team: { type: String, required: true }, // Name of the football team
  price: { type: Number, required: true }, // Price of the jersey
  description: { type: String }, // Description of the jersey
  sizes: {
    type: [String], // Array of available sizes
    validate: {
      validator: function (v) {
        const allowedSizes = ['16', '18', '20', '22', '24', '26', '28', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
        return v.every(size => allowedSizes.includes(size));
      },
      message: "Invalid size detected"
    }
  },
  stock: { type: Number, required: true, min: 0 }, // Stock available
  customization: {
    enabled: { type: Boolean, default: false }, // Whether customization is available
    details: { type: String } // Customization details (if any)
  },
  popularity: { type: Number, default: 0 }, // Popularity rank or score
  image: { type: String } // New field for image URL (or file path)
});


productSchema.index({ name: "text", team: "text", description: "text" });


const Product = mongoose.model('Product', productSchema);

export default Product;
