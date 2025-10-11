import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();

// Middleware: parseo de JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Inicia servidor en puerto 8080
const PORT = 8080;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
