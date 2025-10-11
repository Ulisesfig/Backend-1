
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

// ProductManager: gestiona productos en el archivo JSON indicado
class ProductManager {
  constructor(filePath) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.path = filePath || path.resolve(__dirname, '../../data/products.json');
  }

  // Leer y parsear productos (devuelve [] si no existe)
  async _readProducts() {
    try {
      const json = await fs.readFile(this.path, 'utf-8');
      if (!json.trim()) return [];
      return JSON.parse(json);
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  // Guardar array de productos en el archivo
  async _writeProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  // Devuelve todos los productos
  async getProducts() {
    return await this._readProducts();
  }

  // Devuelve un producto por id (lanza Error si no existe)
  async getProductById(id) {
    const products = await this._readProducts();
    const product = products.find(p => String(p.id) === String(id));
    if (!product) throw new Error(`Producto con id ${id} no encontrado.`);
    return product;
  }

  // Crea un producto nuevo (valida campos y código único)
  async addProduct(productData) {
    if (!productData.title || !productData.description || !productData.code || productData.price === undefined || productData.stock === undefined || !productData.category) {
      throw new Error("Todos los campos son obligatorios, excepto 'thumbnails'.");
    }

    const products = await this._readProducts();
    if (products.some(p => p.code === productData.code)) {
      throw new Error(`Ya existe un producto con el código ${productData.code}.`);
    }

    const newProduct = {
      id: randomUUID(),
      status: productData.status !== undefined ? productData.status : true,
      ...productData,
    };

    products.push(newProduct);
    await this._writeProducts(products);
    return newProduct;
  }

  // Actualiza un producto (no permite cambiar el id)
  async updateProduct(id, updatedFields) {
    const products = await this._readProducts();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error(`Producto con id ${id} no encontrado.`);

    if (updatedFields.id) delete updatedFields.id;
    products[idx] = { ...products[idx], ...updatedFields };
    await this._writeProducts(products);
    return products[idx];
  }

  // Elimina un producto por id
  async deleteProduct(id) {
    const products = await this._readProducts();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error(`Producto con id ${id} no encontrado.`);
    products.splice(idx, 1);
    await this._writeProducts(products);
  }
}

export default ProductManager;
