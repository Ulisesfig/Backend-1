import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El ID del producto es requerido']
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      default: 1,
      min: [1, 'La cantidad debe ser al menos 1'],
      validate: {
        validator: Number.isInteger,
        message: 'La cantidad debe ser un número entero'
      }
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Cart', cartSchema);
