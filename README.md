# Backend 1 - Entrega Final

Proyecto de e-commerce con Node.js, Express, Handlebars, WebSockets y MongoDB.

## Descripción

API REST para gestionar productos y carritos de compra, con vistas dinámicas que se actualizan en tiempo real usando Socket.io. Los datos se persisten en MongoDB.

## Requisitos

- Node.js 14+
- Conexión a internet (usa MongoDB Atlas en la nube)

## Instalación

```bash
npm install
```

## Configuración de MongoDB

El proyecto está configurado para usar **MongoDB Atlas** (base de datos en la nube). No necesitas instalar MongoDB localmente.

**URI de conexión:**
```
mongodb+srv://coder:coderpass@ecommerce-cluster.hfpm6nh.mongodb.net/myEcommerce
```

### Poblar la base de datos con datos de ejemplo:

```bash
npm run seed
```

Esto creará 10 productos de ejemplo en MongoDB Atlas.

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

### Vistas
- **/** - Redirige a /products
- **/products** - Lista paginada de productos con filtros
- **/products/:pid** - Detalle de un producto individual
- **/carts/:cid** - Vista del carrito de compras
- **/realtimeproducts** - Vista con actualización en tiempo real

## API Endpoints

### Productos
- **GET /api/products** - Listar productos con paginación
  - Query params: `limit`, `page`, `sort` (asc/desc), `query` (filtro por categoría)
- **GET /api/products/:pid** - Ver producto por ID
- **POST /api/products** - Crear producto
- **PUT /api/products/:pid** - Actualizar producto
- **DELETE /api/products/:pid** - Eliminar producto

### Carritos
- **POST /api/carts** - Crear carrito nuevo
- **GET /api/carts/:cid** - Ver carrito con productos populados
- **POST /api/carts/:cid/product/:pid** - Agregar producto al carrito
- **DELETE /api/carts/:cid/products/:pid** - Eliminar producto del carrito
- **PUT /api/carts/:cid** - Actualizar carrito completo
- **PUT /api/carts/:cid/products/:pid** - Actualizar cantidad de un producto
- **DELETE /api/carts/:cid** - Vaciar el carrito

## Tecnologías

- Node.js
- Express
- Handlebars
- Socket.io
- MongoDB / Mongoose
- mongoose-paginate-v2

## Estructura

```
src/
├── app.js                      # Servidor principal
├── index.js                    # Punto de entrada
├── models/                     # Modelos de Mongoose
│   ├── Product.model.js        # Esquema de productos
│   └── Cart.model.js           # Esquema de carritos
├── managers/                   # Lógica de negocio
│   ├── ProductManager.js       # Manager con archivos JSON (legacy)
│   ├── ProductManager.mongo.js # Manager con MongoDB
│   ├── CartManager.js          # Manager con archivos JSON (legacy)
│   └── CartManager.mongo.js    # Manager con MongoDB
├── routes/                     # Rutas de la API y vistas
│   ├── products.js             # API de productos
│   ├── carts.js                # API de carritos
│   └── views.js                # Rutas de vistas
└── views/                      # Templates de Handlebars
    ├── layouts/
    │   └── main.handlebars     # Layout principal
    ├── home.handlebars         # Vista principal (legacy)
    ├── products.handlebars     # Lista de productos paginada
    ├── productDetail.handlebars # Detalle de producto
    ├── cart.handlebars         # Vista del carrito
    └── realTimeProducts.handlebars # Vista tiempo real
```
├── managers/           # Lógica de negocio
├── routes/             # Rutas de la API
└── views/              # Plantillas Handlebars
```

## Datos

Los datos se guardan en archivos JSON en la carpeta `data/`.
