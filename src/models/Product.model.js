import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres']
  },
  code: {
    type: String,
    required: [true, 'El código es requerido'],
    unique: true,
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    validate: {
      validator: Number.isInteger,
      message: 'El stock debe ser un número entero'
    }
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true
  },
  status: {
    type: Boolean,
    default: true
  },
  thumbnails: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', productSchema);
