
import express from 'express';
import CartManager from '../managers/CartManager.mongo.js';
import ProductManager from '../managers/ProductManager.mongo.js';

const router = express.Router();
const cm = new CartManager();
const pm = new ProductManager();

// Crea un carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await cm.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Obtiene los productos de un carrito (con populate)
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error.message });
  }
});

// Agrega un producto al carrito (o incrementa la cantidad)
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const cartId = req.params.cid;
    
    // Validar formato de IDs
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'ID de producto inválido' 
      });
    }
    
    if (!cartId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'ID de carrito inválido' 
      });
    }
    
    // Validar existencia del producto
    await pm.getProductById(productId);

    const updatedCart = await cm.addProductToCart(cartId, productId);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    if (error.message.includes('Producto')) {
      res.status(404).json({ status: 'error', error: `Producto con id ${req.params.pid} no encontrado.` });
    } else if (error.message.includes('Carrito')) {
      res.status(404).json({ status: 'error', error: `Carrito con id ${req.params.cid} no encontrado.` });
    } else {
      res.status(500).json({ status: 'error', error: error.message });
    }
  }
});

// NUEVO: Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cm.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error.message });
  }
});

// NUEVO: Actualizar todo el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'El body debe contener un array de productos' 
      });
    }
    
    // Validar estructura de cada producto
    for (const item of products) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({ 
          status: 'error', 
          error: 'Cada producto debe tener las propiedades "product" y "quantity"' 
        });
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        return res.status(400).json({ 
          status: 'error', 
          error: 'La cantidad debe ser un número mayor a 0' 
        });
      }
    }
    
    const updatedCart = await cm.updateCart(req.params.cid, products);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ status: 'error', error: error.message });
    } else {
      res.status(400).json({ status: 'error', error: error.message });
    }
  }
});

// NUEVO: Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'Debe proporcionar la cantidad' 
      });
    }
    
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'La cantidad debe ser un número mayor a 0' 
      });
    }
    
    const updatedCart = await cm.updateProductQuantity(
      req.params.cid, 
      req.params.pid, 
      quantity
    );
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ status: 'error', error: error.message });
    } else {
      res.status(400).json({ status: 'error', error: error.message });
    }
  }
});

// NUEVO: Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const updatedCart = await cm.clearCart(req.params.cid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error.message });
  }
});

export default router;
