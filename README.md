# Backend 1 - Entrega 2

Proyecto de e-commerce con Node.js, Express, Handlebars y WebSockets.

## Descripción

API REST para gestionar productos y carritos de compra, con vistas dinámicas que se actualizan en tiempo real usando Socket.io.

## Instalación

```bash
npm install
```

## Uso

Iniciar el servidor:

```bash
node src/app.js
```

O en modo desarrollo:

```bash
npm run dev
```

El servidor corre en http://localhost:8080

## Rutas principales

- **/** - Vista principal con todos los productos
- **/realtimeproducts** - Vista con actualización en tiempo real

## API Endpoints

### Productos
- GET /api/products - Listar productos
- GET /api/products/:pid - Ver producto por ID
- POST /api/products - Crear producto
- PUT /api/products/:pid - Actualizar producto
- DELETE /api/products/:pid - Eliminar producto

### Carritos
- POST /api/carts - Crear carrito
- GET /api/carts/:cid - Ver carrito
- POST /api/carts/:cid/product/:pid - Agregar producto al carrito

## Tecnologías

- Node.js
- Express
- Handlebars
- Socket.io

## Estructura

```
src/
├── app.js              # Servidor principal
├── managers/           # Lógica de negocio
├── routes/             # Rutas de la API
└── views/              # Plantillas Handlebars
```

## Datos

Los datos se guardan en archivos JSON en la carpeta `data/`.
