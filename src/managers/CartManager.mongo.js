import Cart from '../models/Cart.model.js';

class CartManager {
  // Crear carrito
  async createCart() {
    try {
      const cart = new Cart({ products: [] });
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error creando carrito: ${error.message}`);
    }
  }

  // Obtener carrito por ID con populate
  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate('products.product');
      if (!cart) {
        throw new Error(`Carrito con id ${id} no encontrado.`);
      }
      return cart;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID de carrito inválido: ${id}`);
      }
      throw new Error(`Error obteniendo carrito: ${error.message}`);
    }
  }

  // Agregar producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito con id ${cartId} no encontrado.`);
      }

      const productIndex = cart.products.findIndex(
        p => p.product.toString() === productId
      );

      if (productIndex !== -1) {
        // Incrementar cantidad si ya existe
        cart.products[productIndex].quantity += 1;
      } else {
        // Agregar nuevo producto
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      return await this.getCartById(cartId); // Devolver con populate
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID inválido proporcionado.`);
      }
      throw new Error(`Error agregando producto al carrito: ${error.message}`);
    }
  }

  // Eliminar producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito con id ${cartId} no encontrado.`);
      }

      cart.products = cart.products.filter(
        p => p.product.toString() !== productId
      );

      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error eliminando producto del carrito: ${error.message}`);
    }
  }

  // Actualizar todo el carrito
  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito con id ${cartId} no encontrado.`);
      }

      cart.products = products;
      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw new Error(`Errores de validación: ${messages.join(', ')}`);
      }
      if (error.name === 'CastError') {
        throw new Error(`ID de carrito inválido: ${cartId}`);
      }
      throw new Error(`Error actualizando carrito: ${error.message}`);
    }
  }

  // Actualizar cantidad de un producto
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito con id ${cartId} no encontrado.`);
      }

      const productIndex = cart.products.findIndex(
        p => p.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error(`Producto no encontrado en el carrito.`);
      }

      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return await this.getCartById(cartId);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw new Error(`Errores de validación: ${messages.join(', ')}`);
      }
      throw new Error(`Error actualizando cantidad: ${error.message}`);
    }
  }

  // Eliminar todos los productos del carrito
  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito con id ${cartId} no encontrado.`);
      }

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error vaciando carrito: ${error.message}`);
    }
  }
}

export default CartManager;
