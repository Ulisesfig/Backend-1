import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const pm = new ProductManager();

// Ruta: Home - lista estática de productos
router.get('/', async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render('home', { 
      title: 'Lista de Productos',
      products,
      hasProducts: products.length > 0
    });
  } catch (error) {
    res.render('home', { 
      title: 'Lista de Productos',
      error: error.message,
      products: [],
      hasProducts: false
    });
  }
});

// Ruta: Real Time Products - lista con websockets
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render('realTimeProducts', { 
      title: 'Productos en Tiempo Real',
      products,
      hasProducts: products.length > 0
    });
  } catch (error) {
    res.render('realTimeProducts', { 
      title: 'Productos en Tiempo Real',
      error: error.message,
      products: [],
      hasProducts: false
    });
  }
});

export default router;
