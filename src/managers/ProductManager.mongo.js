import Product from '../models/Product.model.js';

class ProductManager {
  // Obtener productos con paginación, filtros y ordenamiento
  async getProducts(options = {}) {
    try {
      const {
        limit = 10,
        page = 1,
        sort,
        query
      } = options;

      // Construir filtro
      const filter = {};
      if (query) {
        // Buscar por categoría o disponibilidad
          if (query.category) {
            // Permitir coincidencia parcial e insensible a mayúsculas/minúsculas
            filter.category = { $regex: query.category, $options: 'i' };
          }
        if (query.status !== undefined) {
          filter.status = query.status === 'true' || query.status === true;
        }
      }

      // Configurar ordenamiento
      const sortOption = {};
      if (sort) {
        sortOption.price = sort === 'asc' ? 1 : -1;
      }

      // Ejecutar consulta con paginación
      const result = await Product.paginate(filter, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOption,
        lean: true
      });

      return result;
    } catch (error) {
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }
  }

  // Obtener todos los productos (sin paginación) para WebSocket
  async getAllProducts() {
    try {
      return await Product.find().lean();
    } catch (error) {
      throw new Error(`Error obteniendo todos los productos: ${error.message}`);
    }
  }

  // Obtener producto por ID
  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error(`Producto con id ${id} no encontrado.`);
      }
      return product;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID de producto inválido: ${id}`);
      }
      throw new Error(`Error obteniendo producto: ${error.message}`);
    }
  }

  // Crear producto
  async addProduct(productData) {
    try {
      // Validar datos básicos antes de crear
      if (!productData.title || !productData.description || !productData.code || 
          productData.price === undefined || productData.stock === undefined || 
          !productData.category) {
        throw new Error('Faltan campos requeridos para crear el producto.');
      }

      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(`Ya existe un producto con el código ${productData.code}.`);
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw new Error(`Errores de validación: ${messages.join(', ')}`);
      }
      throw new Error(`Error creando producto: ${error.message}`);
    }
  }

  // Actualizar producto
  async updateProduct(id, updatedFields) {
    try {
      // No permitir cambiar el id o el code
      delete updatedFields._id;
      delete updatedFields.code;
      
      const product = await Product.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true, runValidators: true }
      );
      
      if (!product) {
        throw new Error(`Producto con id ${id} no encontrado.`);
      }
      
      return product;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw new Error(`Errores de validación: ${messages.join(', ')}`);
      }
      if (error.name === 'CastError') {
        throw new Error(`ID de producto inválido: ${id}`);
      }
      throw new Error(`Error actualizando producto: ${error.message}`);
    }
  }

  // Eliminar producto
  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        throw new Error(`Producto con id ${id} no encontrado.`);
      }
      return product;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID de producto inválido: ${id}`);
      }
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }
}

export default ProductManager;
