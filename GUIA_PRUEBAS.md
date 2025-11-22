# 🧪 Guía de Pruebas - API Endpoints

## 📦 Productos

### 1. GET /api/products - Listar productos con paginación

**Sin parámetros (default):**
```
GET http://localhost:8080/api/products
```

**Con paginación:**
```
GET http://localhost:8080/api/products?limit=5&page=1
GET http://localhost:8080/api/products?limit=3&page=2
```

**Con ordenamiento por precio:**
```
GET http://localhost:8080/api/products?sort=asc
GET http://localhost:8080/api/products?sort=desc
```

**Filtro por categoría:**
```
GET http://localhost:8080/api/products?category=Accesorios
GET http://localhost:8080/api/products?category=Audio
GET http://localhost:8080/api/products?category=Computadoras
```

**Filtro por disponibilidad:**
```
GET http://localhost:8080/api/products?status=true
GET http://localhost:8080/api/products?status=false
```

**Combinación de filtros:**
```
GET http://localhost:8080/api/products?category=Accesorios&sort=asc&limit=5
GET http://localhost:8080/api/products?category=Audio&sort=desc
GET http://localhost:8080/api/products?status=true&sort=asc
```

**Respuesta esperada:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 2,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?page=2&limit=5"
}
```

---

### 2. GET /api/products/:pid - Obtener producto por ID

```
GET http://localhost:8080/api/products/[PRODUCT_ID]
```

**Ejemplos de prueba:**
- ✅ **ID válido existente:** Devuelve el producto
- ❌ **ID válido no existente:** Error 404 - "Producto con id ... no encontrado"
- ❌ **ID inválido:** Error - "ID de producto inválido"

---

### 3. POST /api/products - Crear producto

**Caso exitoso:**
```json
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "title": "Tablet Apple iPad Pro",
  "description": "Tablet de 12.9 pulgadas con chip M2",
  "code": "IPAD001",
  "price": 25999,
  "stock": 10,
  "category": "Tablets",
  "thumbnails": ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"]
}
```

**Validaciones a probar:**

❌ **Campos faltantes:**
```json
{
  "title": "Producto sin descripción",
  "code": "TEST001"
}
```
**Respuesta:** `400 - "Faltan campos requeridos: title, description, code, price, stock, category"`

❌ **Precio negativo:**
```json
{
  "title": "Test",
  "description": "Test description long enough",
  "code": "TEST002",
  "price": -100,
  "stock": 10,
  "category": "Test"
}
```
**Respuesta:** `400 - "El precio debe ser un número positivo"`

❌ **Stock negativo:**
```json
{
  "title": "Test",
  "description": "Test description long enough",
  "code": "TEST003",
  "price": 100,
  "stock": -5,
  "category": "Test"
}
```
**Respuesta:** `400 - "El stock debe ser un número positivo"`

❌ **Código duplicado:**
```json
{
  "title": "Producto Duplicado",
  "description": "Tiene el mismo código que otro",
  "code": "LAP001",
  "price": 100,
  "stock": 10,
  "category": "Test"
}
```
**Respuesta:** `400 - "Ya existe un producto con el código LAP001"`

---

### 4. PUT /api/products/:pid - Actualizar producto

**Caso exitoso:**
```json
PUT http://localhost:8080/api/products/[PRODUCT_ID]
Content-Type: application/json

{
  "price": 44999,
  "stock": 20
}
```

**Validaciones a probar:**

❌ **Body vacío:**
```json
PUT http://localhost:8080/api/products/[PRODUCT_ID]
Content-Type: application/json

{}
```
**Respuesta:** `400 - "Debe proporcionar al menos un campo para actualizar"`

❌ **Precio inválido:**
```json
{
  "price": -500
}
```
**Respuesta:** `400 - "El precio debe ser un número positivo"`

❌ **Stock inválido:**
```json
{
  "stock": -10
}
```
**Respuesta:** `400 - "El stock debe ser un número positivo"`

❌ **Producto no existe:**
```
PUT http://localhost:8080/api/products/000000000000000000000000
```
**Respuesta:** `404 - "Producto con id ... no encontrado"`

---

### 5. DELETE /api/products/:pid - Eliminar producto

```
DELETE http://localhost:8080/api/products/[PRODUCT_ID]
```

**Respuestas:**
- ✅ **Exitoso:** Status 204 (sin contenido)
- ❌ **No existe:** Status 404 - "Producto con id ... no encontrado"

---

## 🛒 Carritos

### 1. POST /api/carts - Crear carrito

```
POST http://localhost:8080/api/carts
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": {
    "_id": "65abc123...",
    "products": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Guardar el `_id` del carrito para las siguientes pruebas.**

---

### 2. GET /api/carts/:cid - Obtener carrito (con populate)

```
GET http://localhost:8080/api/carts/[CART_ID]
```

**Respuesta con productos:**
```json
{
  "status": "success",
  "payload": {
    "_id": "65abc123...",
    "products": [
      {
        "product": {
          "_id": "65def456...",
          "title": "Laptop HP Pavilion",
          "price": 45999,
          "description": "...",
          "stock": 15,
          "category": "Computadoras",
          ...
        },
        "quantity": 2
      }
    ]
  }
}
```

**Validaciones:**
- ❌ **ID inválido:** "ID de carrito inválido"
- ❌ **Carrito no existe:** "Carrito con id ... no encontrado"

---

### 3. POST /api/carts/:cid/product/:pid - Agregar producto al carrito

```
POST http://localhost:8080/api/carts/[CART_ID]/product/[PRODUCT_ID]
```

**Comportamiento:**
- Si el producto ya existe: incrementa cantidad en 1
- Si el producto no existe: lo agrega con cantidad 1

**Validaciones a probar:**

❌ **ID de carrito inválido:**
```
POST http://localhost:8080/api/carts/invalidid/product/[PRODUCT_ID]
```
**Respuesta:** `400 - "ID de carrito inválido"`

❌ **ID de producto inválido:**
```
POST http://localhost:8080/api/carts/[CART_ID]/product/invalidid
```
**Respuesta:** `400 - "ID de producto inválido"`

❌ **Producto no existe:**
```
POST http://localhost:8080/api/carts/[CART_ID]/product/000000000000000000000000
```
**Respuesta:** `404 - "Producto con id ... no encontrado"`

---

### 4. DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito

```
DELETE http://localhost:8080/api/carts/[CART_ID]/products/[PRODUCT_ID]
```

**Comportamiento:** Elimina el producto completamente del carrito (sin importar la cantidad).

**Validaciones:**
- ❌ **Carrito no existe:** `404 - "Carrito con id ... no encontrado"`
- ❌ **Producto no está en el carrito:** Se procesa sin error (no lo encuentra para eliminar)

---

### 5. PUT /api/carts/:cid - Actualizar todo el carrito

**Caso exitoso:**
```json
PUT http://localhost:8080/api/carts/[CART_ID]
Content-Type: application/json

{
  "products": [
    { "product": "65abc123...", "quantity": 3 },
    { "product": "65def456...", "quantity": 1 },
    { "product": "65ghi789...", "quantity": 5 }
  ]
}
```

**Validaciones a probar:**

❌ **No es array:**
```json
{
  "products": "esto no es un array"
}
```
**Respuesta:** `400 - "El body debe contener un array de productos"`

❌ **Falta propiedad product:**
```json
{
  "products": [
    { "quantity": 3 }
  ]
}
```
**Respuesta:** `400 - "Cada producto debe tener las propiedades 'product' y 'quantity'"`

❌ **Cantidad inválida:**
```json
{
  "products": [
    { "product": "65abc123...", "quantity": 0 }
  ]
}
```
**Respuesta:** `400 - "La cantidad debe ser un número mayor a 0"`

❌ **Cantidad no es número:**
```json
{
  "products": [
    { "product": "65abc123...", "quantity": "tres" }
  ]
}
```
**Respuesta:** `400 - "La cantidad debe ser un número mayor a 0"`

---

### 6. PUT /api/carts/:cid/products/:pid - Actualizar cantidad de un producto

**Caso exitoso:**
```json
PUT http://localhost:8080/api/carts/[CART_ID]/products/[PRODUCT_ID]
Content-Type: application/json

{
  "quantity": 5
}
```

**Validaciones a probar:**

❌ **Falta quantity:**
```json
PUT http://localhost:8080/api/carts/[CART_ID]/products/[PRODUCT_ID]
Content-Type: application/json

{}
```
**Respuesta:** `400 - "Debe proporcionar la cantidad"`

❌ **Cantidad menor a 1:**
```json
{
  "quantity": 0
}
```
**Respuesta:** `400 - "La cantidad debe ser un número mayor a 0"`

❌ **Cantidad negativa:**
```json
{
  "quantity": -5
}
```
**Respuesta:** `400 - "La cantidad debe ser un número mayor a 0"`

❌ **Producto no está en el carrito:**
```
PUT http://localhost:8080/api/carts/[CART_ID]/products/000000000000000000000000
Content-Type: application/json

{
  "quantity": 5
}
```
**Respuesta:** `404 - "Producto no encontrado en el carrito"`

---

### 7. DELETE /api/carts/:cid - Vaciar carrito

```
DELETE http://localhost:8080/api/carts/[CART_ID]
```

**Comportamiento:** Elimina todos los productos del carrito, dejándolo vacío.

**Respuesta:**
```json
{
  "status": "success",
  "payload": {
    "_id": "65abc123...",
    "products": []
  }
}
```

---

## 🎨 Vistas (Navegador)

### 1. Lista de productos
```
http://localhost:8080/products
```
**Pruebas:**
- Hacer clic en "Anterior" y "Siguiente"
- Cambiar filtro de categoría
- Cambiar ordenamiento
- Cambiar límite de productos por página
- Hacer clic en "Ver detalle"
- Hacer clic en "Agregar al carrito"

### 2. Detalle de producto
```
http://localhost:8080/products/[PRODUCT_ID]
```
**Pruebas:**
- Cambiar cantidad
- Hacer clic en "Agregar al carrito"
- Verificar que se crea un carrito en localStorage
- Hacer clic en "← Volver a productos"

### 3. Carrito
```
http://localhost:8080/carts/[CART_ID]
```
**Pruebas:**
- Ver productos con información completa (populate funcionando)
- Incrementar/decrementar cantidad con botones +/-
- Cambiar cantidad manualmente en el input
- Hacer clic en "🗑️" para eliminar un producto
- Hacer clic en "Vaciar carrito"
- Verificar que el total se calcula correctamente
- Hacer clic en "← Continuar comprando"

### 4. Productos en tiempo real
```
http://localhost:8080/realtimeproducts
```
**Pruebas:**
- Llenar el formulario y crear un producto
- Verificar que se actualiza automáticamente
- Hacer clic en "🗑️ Eliminar" en un producto
- Abrir en dos pestañas y verificar sincronización

### 5. Navegación
- Hacer clic en "Productos" en el navbar
- Hacer clic en "Real Time Products" en el navbar
- Hacer clic en "🛒 Mi Carrito" (debe abrir el carrito guardado en localStorage)

---

## 🔧 Herramientas recomendadas

### Postman / Thunder Client
Importar las siguientes colecciones para pruebas rápidas:

**Variables de entorno:**
- `baseUrl`: http://localhost:8080
- `cartId`: [ID_CARRITO_CREADO]
- `productId`: [ID_PRODUCTO_EXISTENTE]

### cURL (desde terminal)

**Crear carrito:**
```bash
curl -X POST http://localhost:8080/api/carts
```

**Listar productos con filtros:**
```bash
curl "http://localhost:8080/api/products?category=Accesorios&sort=asc"
```

**Agregar producto al carrito:**
```bash
curl -X POST http://localhost:8080/api/carts/[CART_ID]/product/[PRODUCT_ID]
```

**Actualizar cantidad:**
```bash
curl -X PUT http://localhost:8080/api/carts/[CART_ID]/products/[PRODUCT_ID] \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

---

## ✅ Checklist de Pruebas

### Productos
- [ ] GET /api/products - paginación funcional
- [ ] GET /api/products?category=X - filtro por categoría
- [ ] GET /api/products?status=true - filtro por disponibilidad
- [ ] GET /api/products?sort=asc - ordenamiento ascendente
- [ ] GET /api/products?sort=desc - ordenamiento descendente
- [ ] POST /api/products - crear con datos válidos
- [ ] POST /api/products - error con campos faltantes
- [ ] POST /api/products - error con precio negativo
- [ ] POST /api/products - error con código duplicado
- [ ] PUT /api/products/:pid - actualizar correctamente
- [ ] PUT /api/products/:pid - error con body vacío
- [ ] DELETE /api/products/:pid - eliminar correctamente

### Carritos
- [ ] POST /api/carts - crear carrito vacío
- [ ] GET /api/carts/:cid - obtener con populate
- [ ] POST /api/carts/:cid/product/:pid - agregar producto
- [ ] POST /api/carts/:cid/product/:pid - incrementar cantidad
- [ ] DELETE /api/carts/:cid/products/:pid - eliminar producto
- [ ] PUT /api/carts/:cid - actualizar carrito completo
- [ ] PUT /api/carts/:cid - error con array inválido
- [ ] PUT /api/carts/:cid/products/:pid - actualizar cantidad
- [ ] PUT /api/carts/:cid/products/:pid - error con cantidad < 1
- [ ] DELETE /api/carts/:cid - vaciar carrito

### Vistas
- [ ] /products - paginación funcional en vista
- [ ] /products - filtros funcionan correctamente
- [ ] /products/:pid - detalle de producto se muestra
- [ ] /carts/:cid - productos se muestran con populate
- [ ] /carts/:cid - botones de cantidad funcionan
- [ ] /realtimeproducts - WebSocket sincroniza cambios
- [ ] Navegación entre vistas funciona correctamente

---

## 📝 Notas Finales

- Todos los endpoints devuelven respuestas en formato JSON
- Los errores incluyen `status: 'error'` y un mensaje descriptivo
- El servidor no se reinicia ante errores (gracias al middleware global)
- El populate en carritos trae información completa de productos
- Las validaciones funcionan tanto en routes como en models
