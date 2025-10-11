
import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const pm = new ProductManager();

// Lista todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtiene un producto por id
router.get('/:pid', async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Crea un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await pm.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualiza un producto
router.put('/:pid', async (req, res) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    res.json(updated);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Elimina un producto
router.delete('/:pid', async (req, res) => {
  try {
    await pm.deleteProduct(req.params.pid);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
