
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

// CartManager: gestiona carritos en el archivo JSON indicado
class CartManager {
  constructor(filePath) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.path = filePath || path.resolve(__dirname, '../../data/carts.json');
  }

  // Leer y parsear carritos (devuelve [] si no existe)
  async _readCarts() {
    try {
      const json = await fs.readFile(this.path, 'utf-8');
      if (!json.trim()) return [];
      return JSON.parse(json);
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  // Guardar array de carritos en el archivo
  async _writeCarts(carts) {
    // Asegurar que el directorio exista antes de escribir
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  // Crea un carrito nuevo con id y products=[]
  async createCart() {
    const carts = await this._readCarts();
    const newCart = { id: randomUUID(), products: [] };
    carts.push(newCart);
    await this._writeCarts(carts);
    return newCart;
  }

  // Obtiene un carrito por id (lanza Error si no existe)
  async getCartById(id) {
    const carts = await this._readCarts();
    const cart = carts.find(c => String(c.id) === String(id));
    if (!cart) throw new Error(`Carrito con id ${id} no encontrado.`);
    return cart;
  }

  // Agrega un producto al carrito o incrementa su cantidad
  async addProductToCart(cartId, productId) {
    const carts = await this._readCarts();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
    if (idx === -1) throw new Error(`Carrito con id ${cartId} no encontrado.`);

    const cart = carts[idx];
    const prodIdx = cart.products.findIndex(p => String(p.product) === String(productId));
    if (prodIdx !== -1) {
      cart.products[prodIdx].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[idx] = cart;
    await this._writeCarts(carts);
    return cart;
  }
}

export default CartManager;
