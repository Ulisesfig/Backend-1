
import express from 'express';
import ProductManager from '../managers/ProductManager.mongo.js';

const router = express.Router();
const pm = new ProductManager();

// Lista todos los productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query, category, status } = req.query;
    
    // Construir objeto de opciones
    const options = {
      limit: limit || 10,
      page: page || 1
    };

    if (sort) {
      options.sort = sort;
    }

    // Construir filtros
    options.query = {};
    
    if (query) {
      // Parsear query para filtros complejos (category o status)
      try {
        options.query = JSON.parse(query);
      } catch {
        // Si no es JSON, asumir que es categoría
        options.query = { category: query };
      }
    }
    
    // Filtros individuales (pueden sobrescribir query)
    if (category) {
      options.query.category = category;
    }
    
    if (status !== undefined) {
      options.query.status = status === 'true' || status === true;
    }

    const result = await pm.getProducts(options);
    
    // Construir links de navegación
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildLink = (pageNum) => {
      const params = new URLSearchParams();
      params.set('page', pageNum);
      if (limit) params.set('limit', limit);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return `${baseUrl}?${params.toString()}`;
    };

    // Formato de respuesta según especificación
    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
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
    // Validar campos requeridos
    const { title, description, code, price, stock, category } = req.body;
    
    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'Faltan campos requeridos: title, description, code, price, stock, category' 
      });
    }

    // Validar tipos de datos
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'El precio debe ser un número positivo' 
      });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'El stock debe ser un número positivo' 
      });
    }

    const newProduct = await pm.addProduct(req.body);
    
    // Emitir evento websocket para actualizar vista en tiempo real
    if (req.io) {
      const products = await pm.getAllProducts();
      req.io.emit('products', products);
    }
    
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// Actualiza un producto
router.put('/:pid', async (req, res) => {
  try {
    // Validar que se envíe al menos un campo para actualizar
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'Debe proporcionar al menos un campo para actualizar' 
      });
    }

    // Validar tipos si se proporcionan
    if (req.body.price !== undefined && (typeof req.body.price !== 'number' || req.body.price < 0)) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'El precio debe ser un número positivo' 
      });
    }

    if (req.body.stock !== undefined && (typeof req.body.stock !== 'number' || req.body.stock < 0)) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'El stock debe ser un número positivo' 
      });
    }

    const updated = await pm.updateProduct(req.params.pid, req.body);
    
    // Emitir evento websocket para actualizar vista en tiempo real
    if (req.io) {
      const products = await pm.getAllProducts();
      req.io.emit('products', products);
    }
    
    res.json({ status: 'success', payload: updated });
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ status: 'error', error: error.message });
    } else {
      res.status(400).json({ status: 'error', error: error.message });
    }
  }
});

// Elimina un producto
router.delete('/:pid', async (req, res) => {
  try {
    await pm.deleteProduct(req.params.pid);
    
    // Emitir evento websocket para actualizar vista en tiempo real
    if (req.io) {
      const products = await pm.getAllProducts();
      req.io.emit('products', products);
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ status: 'error', error: error.message });
  }
});

export default router;
