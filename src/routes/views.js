import express from 'express';
import ProductManager from '../managers/ProductManager.mongo.js';
import CartManager from '../managers/CartManager.mongo.js';

const router = express.Router();
const pm = new ProductManager();
const cm = new CartManager();

// Ruta: Home - redirigir a /products
router.get('/', (req, res) => {
  res.redirect('/products');
});

// Ruta: Products - lista con paginación
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    
    const options = { limit, page };
    if (sort) options.sort = sort;
    if (query) {
      try {
        options.query = JSON.parse(query);
      } catch {
        options.query = { category: query };
      }
    }

    const result = await pm.getProducts(options);
    
    // Construir query string para links
    const buildQuery = (pageNum) => {
      const params = new URLSearchParams();
      params.set('page', pageNum);
      if (limit) params.set('limit', limit);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return params.toString();
    };

    res.render('products', {
      title: 'Productos',
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage ? `/products?${buildQuery(result.prevPage)}` : null,
      nextLink: result.hasNextPage ? `/products?${buildQuery(result.nextPage)}` : null
    });
  } catch (error) {
    res.render('products', {
      title: 'Productos',
      error: error.message,
      products: []
    });
  }
});

// Ruta: Product Detail - producto individual
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.pid);
    res.render('productDetail', {
      title: product.title,
      product: product
    });
  } catch (error) {
    res.render('productDetail', {
      title: 'Producto no encontrado',
      error: error.message
    });
  }
});

// Ruta: Cart - visualizar carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    res.render('cart', {
      title: 'Mi Carrito',
      cart: cart,
      cartId: req.params.cid,
      products: cart.products
    });
  } catch (error) {
    res.render('cart', {
      title: 'Carrito',
      error: error.message
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
