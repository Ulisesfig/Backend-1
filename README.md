# Entrega 2 - Backend (Products & Carts con Handlebars y WebSockets)

API en Node.js + Express con persistencia en archivos JSON, vistas con Handlebars y actualización en tiempo real con Socket.io.

## Características

- ✅ API REST completa para productos y carritos
- ✅ Vistas con motor de plantillas Handlebars
- ✅ Actualización en tiempo real con WebSockets
- ✅ Persistencia en archivos JSON
- ✅ Interfaz amigable con diseño moderno

## Instalación

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar servidor:

   ```bash
   node src/app.js
   ```

   O en modo desarrollo con auto-reload:

   ```bash
   npm run dev
   ```

3. Abrir navegador en: http://localhost:8080

## Estructura necesaria de datos

Debe existir la carpeta `data/` en la raíz del proyecto con los archivos:

- `data/products.json` (iniciar con `[]`)
- `data/carts.json` (iniciar con `[]`)

Si no existen, el código ahora los crea automáticamente al primer guardado; sin embargo, es recomendable tenerlos presentes desde el inicio.

## Vistas disponibles

### 🏠 Home - `/` o `/home`
Vista estática con lista de todos los productos. Se actualiza al refrescar la página.

### ⚡ Real Time Products - `/realtimeproducts`
Vista dinámica con WebSockets que incluye:
- Lista de productos que se actualiza en tiempo real
- Formulario para crear nuevos productos
- Botón para eliminar productos
- Sin necesidad de refrescar la página

## Endpoints de la API

### Productos

- `GET /api/products` - Listar todos los productos
- `GET /api/products/:pid` - Obtener un producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:pid` - Actualizar un producto
- `DELETE /api/products/:pid` - Eliminar un producto

### Carritos

- `POST /api/carts` - Crear un carrito nuevo
- `GET /api/carts/:cid` - Obtener productos de un carrito
- `POST /api/carts/:cid/product/:pid` - Agregar producto al carrito

## Formato de producto

```json
{
  "title": "Producto ejemplo",
  "description": "Descripción del producto",
  "code": "ABC123",
  "price": 99.99,
  "stock": 10,
  "category": "Electrónica",
  "status": true,
  "thumbnails": ["url1.jpg", "url2.jpg"]
}
```

## Tecnologías utilizadas

- **Express**: Framework web para Node.js
- **express-handlebars**: Motor de plantillas
- **Socket.io**: Comunicación en tiempo real
- **File System (fs)**: Persistencia en JSON

## Características de la Entrega 2

✅ Configuración de Handlebars como motor de plantillas  
✅ Integración de Socket.io para actualizaciones en tiempo real  
✅ Vista `home.handlebars` con lista estática de productos  
✅ Vista `realTimeProducts.handlebars` con WebSockets  
✅ Formulario para crear productos desde la vista  
✅ Botones para eliminar productos en tiempo real  
✅ Sincronización entre API HTTP y WebSockets  
✅ Router de vistas separado (`views.js`)  
✅ ProductManager usado en Socket.io para gestión de productos  
✅ Actualización automática de todas las vistas conectadas

## Probar con Postman o cURL

Crear un producto desde la API:
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop",
    "description": "Laptop gaming",
    "code": "LAP001",
    "price": 1500,
    "stock": 5,
    "category": "Computadoras"
  }'
```

Los cambios se reflejarán automáticamente en `/realtimeproducts` sin refrescar la página.

## Autor

Ulises - Backend 1 Flex - Entrega 2
