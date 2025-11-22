import mongoose from 'mongoose';
import Product from './src/models/Product.model.js';

// Datos de ejemplo
const sampleProducts = [
  {
    title: "Laptop HP Pavilion",
    description: "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD",
    code: "LAP001",
    price: 45999,
    stock: 15,
    category: "Computadoras",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"]
  },
  {
    title: "Mouse Logitech MX Master 3",
    description: "Mouse ergonómico inalámbrico con sensor de alta precisión",
    code: "MOU001",
    price: 1899,
    stock: 50,
    category: "Accesorios",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"]
  },
  {
    title: "Teclado Mecánico RGB",
    description: "Teclado mecánico con switches Cherry MX e iluminación RGB",
    code: "TEC001",
    price: 2499,
    stock: 30,
    category: "Accesorios",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"]
  },
  {
    title: "Monitor Dell 27 pulgadas",
    description: "Monitor Full HD IPS con tecnología FreeSync",
    code: "MON001",
    price: 6999,
    stock: 20,
    category: "Monitores",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"]
  },
  {
    title: "Auriculares Sony WH-1000XM4",
    description: "Auriculares con cancelación de ruido activa",
    code: "AUR001",
    price: 7499,
    stock: 25,
    category: "Audio",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"]
  },
  {
    title: "Webcam Logitech C920",
    description: "Cámara web Full HD 1080p con micrófono estéreo",
    code: "WEB001",
    price: 1599,
    stock: 40,
    category: "Accesorios",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500"]
  },
  {
    title: "SSD Samsung 1TB",
    description: "Disco sólido NVMe M.2 de alta velocidad",
    code: "SSD001",
    price: 2999,
    stock: 35,
    category: "Almacenamiento",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500"]
  },
  {
    title: "Impresora HP LaserJet",
    description: "Impresora láser monocromática con WiFi",
    code: "IMP001",
    price: 4499,
    stock: 12,
    category: "Impresoras",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500"]
  },
  {
    title: "Router TP-Link AC1750",
    description: "Router dual band con 3 antenas",
    code: "ROU001",
    price: 1299,
    stock: 45,
    category: "Redes",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500"]
  },
  {
    title: "Tablet Samsung Galaxy Tab S7",
    description: "Tablet Android 11 pulgadas con S Pen incluido",
    code: "TAB001",
    price: 12999,
    stock: 18,
    category: "Tablets",
    status: true,
    thumbnails: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500"]
  }
];

async function seedDatabase() {
  try {
    // Conectar a MongoDB Atlas
    await mongoose.connect('mongodb+srv://coder:coderpass@ecommerce-cluster.hfpm6nh.mongodb.net/myEcommerce?appName=ecommerce-cluster');
    console.log('✅ Conectado a MongoDB Atlas');

    // Limpiar productos existentes
    await Product.deleteMany({});
    console.log('🗑️  Base de datos limpiada');

    // Insertar productos de ejemplo
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} productos insertados correctamente`);

    // Mostrar algunos productos
    console.log('\n📦 Productos agregados:');
    products.forEach(p => {
      console.log(`  - ${p.title} ($${p.price}) - Stock: ${p.stock}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seedDatabase();
