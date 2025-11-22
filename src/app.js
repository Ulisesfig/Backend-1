import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import ProductManager from './managers/ProductManager.mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://coder:coderpass@ecommerce-cluster.hfpm6nh.mongodb.net/myEcommerce?appName=ecommerce-cluster';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Handlebars con helpers personalizados
app.engine('handlebars', engine({
  helpers: {
    multiply: (a, b) => a * b,
    calculateTotal: (products) => {
      return products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0).toFixed(2);
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware: parseo de JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, 'public')));

// Hacer io disponible en las rutas mediante middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas de vistas
app.use('/', viewsRouter);

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de Socket.io
const pm = new ProductManager();

io.on('connection', async (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Enviar productos iniciales al conectar
  try {
    const products = await pm.getAllProducts();
    socket.emit('products', products);
  } catch (error) {
    socket.emit('error', error.message);
  }

  // Crear producto desde websocket
  socket.on('createProduct', async (productData) => {
    try {
      const newProduct = await pm.addProduct(productData);
      const products = await pm.getAllProducts();
      io.emit('products', products); // Enviar a todos los clientes
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Eliminar producto desde websocket
  socket.on('deleteProduct', async (id) => {
    try {
      await pm.deleteProduct(id);
      const products = await pm.getAllProducts();
      io.emit('products', products); // Enviar a todos los clientes
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Middleware de manejo de errores global (debe ir al final)
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({ 
    status: 'error', 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Inicia servidor en puerto 8080
const PORT = 8080;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
export { io };
