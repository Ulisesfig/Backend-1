# Guía de Pruebas - Entrega 2

## 🚀 Inicio Rápido

1. **Iniciar servidor**:
   ```bash
   node src/app.js
   ```

2. **Abrir navegador**: http://localhost:8080

---

## ✅ Lista de Verificación de Funcionalidades

### 1. Vista Home (Estática)

**Endpoint**: http://localhost:8080/ o http://localhost:8080

**Debe mostrar**:
- ✅ Lista de todos los productos en formato cards
- ✅ Información completa de cada producto (título, código, precio, stock, categoría, estado)
- ✅ Navegación entre Home y Real Time Products
- ✅ Al refrescar la página, se cargan los productos desde `data/products.json`

**Probar**:
1. Abrir http://localhost:8080
2. Ver que los productos se muestran correctamente
3. Refrescar la página (F5) - los productos deben seguir ahí

---

### 2. Vista Real Time Products (WebSockets)

**Endpoint**: http://localhost:8080/realtimeproducts

**Debe mostrar**:
- ✅ Formulario para crear productos (arriba)
- ✅ Lista de productos en tiempo real (abajo)
- ✅ Botón "Eliminar" en cada producto
- ✅ Actualizaciones automáticas SIN refrescar

**Probar - Crear Producto**:
1. Abrir http://localhost:8080/realtimeproducts
2. Llenar formulario:
   - Título: "Laptop Gaming"
   - Descripción: "Laptop de alto rendimiento"
   - Código: "LAP001"
   - Precio: 1500
   - Stock: 10
   - Categoría: "Computadoras"
3. Click en "Crear Producto"
4. ✅ El producto debe aparecer INMEDIATAMENTE en la lista (sin refrescar)
5. ✅ Debe aparecer mensaje de éxito en verde

**Probar - Eliminar Producto**:
1. Click en botón "🗑️ Eliminar" de cualquier producto
2. Confirmar en el diálogo
3. ✅ El producto debe desaparecer INMEDIATAMENTE (sin refrescar)
4. ✅ Debe aparecer mensaje de éxito

**Probar - Múltiples Ventanas**:
1. Abrir http://localhost:8080/realtimeproducts en 2 pestañas
2. Crear un producto en la pestaña 1
3. ✅ El producto debe aparecer AUTOMÁTICAMENTE en la pestaña 2
4. Eliminar un producto en la pestaña 2
5. ✅ Debe desaparecer en AMBAS pestañas

---

### 3. API REST + Integración WebSocket

**Crear producto desde API** (Postman, cURL o Thunder Client):

```bash
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "title": "Mouse Gamer",
  "description": "Mouse RGB de alta precisión",
  "code": "MOU001",
  "price": 45.99,
  "stock": 50,
  "category": "Periféricos"
}
```

**Verificar**:
1. ✅ La API debe responder con el producto creado (status 201)
2. ✅ Abrir http://localhost:8080/realtimeproducts
3. ✅ El nuevo producto debe aparecer AUTOMÁTICAMENTE en la vista
4. ✅ NO es necesario refrescar la página

**Eliminar producto desde API**:

```bash
DELETE http://localhost:8080/api/products/{id}
```

**Verificar**:
1. ✅ La API debe responder con status 204
2. ✅ El producto debe desaparecer AUTOMÁTICAMENTE en `/realtimeproducts`

**Actualizar producto desde API**:

```bash
PUT http://localhost:8080/api/products/{id}
Content-Type: application/json

{
  "price": 39.99,
  "stock": 100
}
```

**Verificar**:
1. ✅ La API debe responder con el producto actualizado
2. ✅ Los cambios deben reflejarse AUTOMÁTICAMENTE en `/realtimeproducts`

---

### 4. Validación de Errores

**Crear producto sin campos requeridos**:
1. En `/realtimeproducts`, intentar enviar el formulario vacío
2. ✅ El navegador debe mostrar error (campos requeridos)

**Crear producto con código duplicado**:
1. Crear producto con código "TEST001"
2. Intentar crear otro con el mismo código
3. ✅ Debe aparecer mensaje de error en rojo

**Eliminar producto inexistente desde API**:
```bash
DELETE http://localhost:8080/api/products/id-inexistente
```
✅ Debe responder con error 404

---

### 5. Persistencia de Datos

**Verificar archivos JSON**:
1. Crear varios productos desde `/realtimeproducts`
2. Detener el servidor (Ctrl+C)
3. Abrir `data/products.json`
4. ✅ Los productos deben estar guardados en formato JSON
5. Reiniciar servidor
6. ✅ Los productos deben seguir apareciendo en las vistas

---

## 🎯 Checklist Final (Criterios de Evaluación)

### Configuración ✅
- [x] Handlebars configurado como motor de plantillas
- [x] Socket.io integrado al servidor HTTP
- [x] Carpeta `views/` con layouts y vistas
- [x] Carpeta `public/` para archivos estáticos

### Vista Home ✅
- [x] Muestra todos los productos de `products.json`
- [x] Se actualiza al refrescar la página
- [x] Muestra mensaje si no hay productos

### Vista Real Time Products ✅
- [x] Muestra todos los productos en tiempo real
- [x] Formulario funcional para crear productos
- [x] Botón eliminar en cada producto
- [x] Actualizaciones automáticas sin refrescar

### WebSockets ✅
- [x] Socket.io funciona correctamente
- [x] ProductManager usado en socket del servidor
- [x] Eventos `createProduct` y `deleteProduct` implementados
- [x] Sincronización entre múltiples clientes

### Rutas ✅
- [x] Rutas API en `/api/products` y `/api/carts`
- [x] Rutas de vistas en router separado (`views.js`)
- [x] Integración de websockets en API HTTP

### Integración HTTP + WebSocket ✅
- [x] POST/PUT/DELETE en `/api/products` emiten eventos socket
- [x] Cambios desde API se reflejan en vista en tiempo real
- [x] `req.io` disponible en todas las rutas

---

## 🐛 Troubleshooting

**Error: Cannot find module 'express-handlebars'**
```bash
npm install express-handlebars socket.io
```

**Error: ENOENT data/products.json**
- Los archivos se crean automáticamente
- O crear manualmente: `echo [] > data/products.json`

**WebSocket no conecta**
- Verificar que el servidor esté corriendo en puerto 8080
- Revisar consola del navegador (F12) para errores
- Verificar que no haya firewall bloqueando conexiones

**Los productos no se actualizan en tiempo real**
- Abrir consola del navegador (F12)
- Verificar logs de Socket.io
- Revisar que no haya errores JavaScript

---

## 📝 Notas Adicionales

- Los IDs se generan con `randomUUID()` de Node.js
- Las imágenes (thumbnails) son opcionales
- El campo `status` por defecto es `true`
- Los websockets funcionan sobre el mismo puerto HTTP (8080)
- Compatible con múltiples clientes simultáneos

---

## 🎉 ¡Éxito!

Si todas las pruebas pasan, la Entrega 2 está completa y lista para ser evaluada.

**Características implementadas**:
✅ Handlebars + Socket.io  
✅ Vista home estática  
✅ Vista realTimeProducts dinámica  
✅ Formularios funcionales  
✅ Eliminación en tiempo real  
✅ Integración API + WebSocket  
✅ Múltiples clientes sincronizados  
✅ Persistencia en JSON  
✅ Diseño moderno y responsive
