import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Handlebars
app.engine('handlebars', engine());
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
    const products = await pm.getProducts();
    socket.emit('products', products);
  } catch (error) {
    socket.emit('error', error.message);
  }

  // Crear producto desde websocket
  socket.on('createProduct', async (productData) => {
    try {
      const newProduct = await pm.addProduct(productData);
      const products = await pm.getProducts();
      io.emit('products', products); // Enviar a todos los clientes
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Eliminar producto desde websocket
  socket.on('deleteProduct', async (id) => {
    try {
      await pm.deleteProduct(id);
      const products = await pm.getProducts();
      io.emit('products', products); // Enviar a todos los clientes
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Inicia servidor en puerto 8080
const PORT = 8080;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
export { io };
