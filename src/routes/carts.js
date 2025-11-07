
import express from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const cm = new CartManager();
const pm = new ProductManager();

// Crea un carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await cm.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtiene los productos de un carrito
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Agrega un producto al carrito (o incrementa la cantidad)
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    // validar existencia del producto
    await pm.getProductById(productId);

    const updatedCart = await cm.addProductToCart(req.params.cid, productId);
    res.json(updatedCart);
  } catch (error) {
    if (error.message.includes('Producto')) {
      res.status(404).json({ error: `Producto con id ${req.params.pid} no encontrado.` });
    } else if (error.message.includes('Carrito')) {
      res.status(404).json({ error: `Carrito con id ${req.params.cid} no encontrado.` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

export default router;
