# Estructura del Proyecto - Backend 1 Entrega 2

```
Backend-1-main/
│
├── data/                          # Persistencia de datos
│   ├── products.json             # Array de productos (creado automáticamente)
│   ├── carts.json                # Array de carritos (creado automáticamente)
│   └── README.md                 # Documentación de la carpeta data
│
├── node_modules/                  # Dependencias instaladas
│
├── src/                           # Código fuente
│   │
│   ├── managers/                  # Gestores de datos
│   │   ├── ProductManager.js     # CRUD de productos en JSON
│   │   └── CartManager.js        # CRUD de carritos en JSON
│   │
│   ├── routes/                    # Rutas/Controladores
│   │   ├── products.js           # API REST de productos + Socket.io
│   │   ├── carts.js              # API REST de carritos
│   │   └── views.js              # Router de vistas (Home, RealTime)
│   │
│   ├── views/                     # Vistas Handlebars
│   │   ├── layouts/
│   │   │   └── main.handlebars   # Layout principal (navbar, estilos)
│   │   ├── home.handlebars       # Vista estática de productos
│   │   └── realTimeProducts.handlebars  # Vista con WebSockets
│   │
│   ├── public/                    # Archivos estáticos (vacío por ahora)
│   │
│   ├── app.js                     # Servidor principal (Express + Socket.io)
│   └── index.js                   # Punto de entrada (no usado actualmente)
│
├── .gitignore                     # Archivos ignorados por Git
├── package.json                   # Dependencias y scripts
├── package-lock.json              # Lock de versiones
├── README.md                      # Documentación principal
└── TESTING.md                     # Guía de pruebas completa
```

## 📦 Dependencias Principales

```json
{
  "express": "^4.18.2",           // Framework web
  "express-handlebars": "latest",  // Motor de plantillas
  "socket.io": "latest",           // WebSockets en tiempo real
  "nodemon": "^2.0.22"            // Auto-reload en desarrollo
}
```

## 🔄 Flujo de Datos

### 1. Crear Producto (WebSocket)
```
Cliente (formulario)
    ↓ socket.emit('createProduct', data)
Servidor (app.js)
    ↓ ProductManager.addProduct()
data/products.json
    ↓ io.emit('products', [...])
Todos los Clientes (actualización automática)
```

### 2. Crear Producto (HTTP API)
```
Cliente (Postman/cURL)
    ↓ POST /api/products
Servidor (routes/products.js)
    ↓ ProductManager.addProduct()
    ↓ req.io.emit('products', [...])
data/products.json + Clientes WebSocket actualizados
```

### 3. Eliminar Producto
```
Cliente (botón eliminar)
    ↓ socket.emit('deleteProduct', id)
Servidor (app.js)
    ↓ ProductManager.deleteProduct(id)
data/products.json (sin producto)
    ↓ io.emit('products', [...])
Todos los Clientes (lista actualizada)
```

## 🎨 Vistas

### Home (/)
- **Tipo**: Estática (server-side rendering)
- **Actualización**: Al refrescar página
- **Tecnología**: Handlebars + HTTP GET

### Real Time Products (/realtimeproducts)
- **Tipo**: Dinámica (client-side rendering)
- **Actualización**: Automática sin refrescar
- **Tecnología**: Handlebars + Socket.io + JavaScript

## 🔌 Endpoints

### Vistas (views.js)
```
GET  /                     → home.handlebars
GET  /realtimeproducts    → realTimeProducts.handlebars
```

### API Productos (products.js)
```
GET    /api/products           → Listar todos
GET    /api/products/:pid      → Obtener uno
POST   /api/products           → Crear (+ emit socket)
PUT    /api/products/:pid      → Actualizar (+ emit socket)
DELETE /api/products/:pid      → Eliminar (+ emit socket)
```

### API Carritos (carts.js)
```
POST /api/carts                     → Crear carrito
GET  /api/carts/:cid                → Ver productos del carrito
POST /api/carts/:cid/product/:pid   → Agregar producto
```

## 🔧 Configuración de Socket.io

### Eventos del Servidor (app.js)
```javascript
io.on('connection', (socket) => {
  // Al conectar → enviar productos actuales
  socket.emit('products', [...])
  
  // Escuchar crear producto
  socket.on('createProduct', (data) => { ... })
  
  // Escuchar eliminar producto
  socket.on('deleteProduct', (id) => { ... })
  
  // Al desconectar
  socket.on('disconnect', () => { ... })
})
```

### Eventos del Cliente (realTimeProducts.handlebars)
```javascript
// Conectar
socket = io()

// Recibir productos
socket.on('products', (products) => { renderProducts(products) })

// Recibir errores
socket.on('error', (msg) => { showError(msg) })

// Enviar crear
socket.emit('createProduct', { title, price, ... })

// Enviar eliminar
socket.emit('deleteProduct', productId)
```

## 🎯 Características Implementadas

✅ **Handlebars**: Motor de plantillas configurado  
✅ **Socket.io**: Servidor websocket integrado  
✅ **Vista Home**: Lista estática de productos  
✅ **Vista RealTime**: Lista dinámica con formulario  
✅ **CRUD Completo**: Create, Read, Update, Delete  
✅ **Sincronización**: API HTTP + WebSockets  
✅ **Múltiples Clientes**: Broadcast a todos los conectados  
✅ **Persistencia**: Archivos JSON con creación automática  
✅ **Validaciones**: Campos requeridos y códigos únicos  
✅ **UX/UI**: Diseño moderno, responsive y amigable  
✅ **Separación**: Routers en archivos independientes  
✅ **ProductManager**: Usado tanto en HTTP como en Sockets  

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor
node src/app.js

# Modo desarrollo (auto-reload)
npm run dev

# Probar endpoints
curl http://localhost:8080/api/products

# Ver logs en tiempo real
# (Los logs de socket aparecen en consola del servidor)
```

## 📊 Flujo de Navegación

```
http://localhost:8080
         │
         ├─→ [/]  → Home (estática)
         │            │
         │            └─→ Link a Real Time Products
         │
         └─→ [/realtimeproducts] → Real Time (websockets)
                      │
                      ├─→ Formulario crear producto
                      ├─→ Lista de productos (actualización automática)
                      └─→ Botones eliminar por producto
```

## 🧪 Testing Rápido

1. **Abrir**: http://localhost:8080/realtimeproducts
2. **Crear producto** desde formulario
3. **Abrir otra pestaña**: http://localhost:8080/realtimeproducts
4. **Verificar**: Ambas pestañas muestran el producto
5. **Eliminar** desde una pestaña
6. **Verificar**: Desaparece en AMBAS pestañas automáticamente

¡Éxito! 🎉

## 📚 Documentación

- **README.md**: Guía completa del proyecto
- **TESTING.md**: Guía de pruebas y validación
- **Este archivo**: Estructura y arquitectura
