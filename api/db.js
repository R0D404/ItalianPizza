// Sistema de almacenamiento persistente en memoria / base de datos para Vercel Serverless
// Compatible con conexión MySQL externa (PlanetScale, Aiven, Supabase, TiDB) o fallback con Seed oficial de BD

let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch (e) {
  // mysql2 no instalado localmente, funcionará en modo memoria de alta velocidad
}

// Catálogo inicial correspondiente exactamente al 02_seed.sql y datos del Sprint 1
const seedPizzas = [
  {
    id_pizza: 1,
    nombre: "Pizza Margherita Tradizionale",
    descripcion: "Salsa de tomate San Marzano artesanal, mozzarella fresca di bufala, albahaca fresca del huerto y aceite de oliva virgen extra.",
    precio: 180.00,
    disponible: true
  },
  {
    id_pizza: 2,
    nombre: "Pizza Pepperoni Rustica",
    descripcion: "Salsa de tomate casera, generosa capa de queso mozzarella derretido y rodajas de pepperoni premium curado al horno.",
    precio: 210.00,
    disponible: true
  },
  {
    id_pizza: 3,
    nombre: "Pizza Quattro Formaggi",
    descripcion: "Base blanca cremosa, combinación de mozzarella, gorgonzola curado, parmesano reggiano rallado y provolone fundido.",
    precio: 240.00,
    disponible: true
  },
  {
    id_pizza: 4,
    nombre: "Pizza Prosciutto e Funghi",
    descripcion: "Salsa pomodoro especial, queso mozzarella, jamón prosciutto italiano en láminas delgadas y champiñones salteados al ajo.",
    precio: 235.00,
    disponible: true
  },
  {
    id_pizza: 5,
    nombre: "Hawaiana Especial",
    descripcion: "Salsa de tomate pomodoro, queso mozzarella artesanal, jamón de pierna ahumado y piña dulce caramelizada.",
    precio: 190.00,
    disponible: true
  }
];

// Pedidos iniciales de muestra (acorde a 03_pedidos_prueba_sprint2.sql y cocina.html)
const seedPedidos = [
  {
    id_pedido: 101,
    cliente: {
      nombre: "Carlos Mendoza",
      telefono: "5543219876"
    },
    items: [
      { id_pizza: 1, nombre: "Pizza Margherita Tradizionale", cantidad: 1, precio_unitario: 180.00 },
      { id_pizza: 2, nombre: "Pizza Pepperoni Rustica", cantidad: 1, precio_unitario: 210.00 }
    ],
    total_pizzas: 2,
    total_monto: 390.00,
    hora_recogida: "16:30",
    fecha: "2026-10-25",
    estado: "En preparación"
  },
  {
    id_pedido: 102,
    cliente: {
      nombre: "Lucía Fernanda Soto",
      telefono: "5598761234"
    },
    items: [
      { id_pizza: 3, nombre: "Pizza Quattro Formaggi", cantidad: 2, precio_unitario: 240.00 }
    ],
    total_pizzas: 2,
    total_monto: 480.00,
    hora_recogida: "17:00",
    fecha: "2026-10-25",
    estado: "Confirmado"
  },
  {
    id_pedido: 103,
    cliente: {
      nombre: "Roberto Garza",
      telefono: "5567894321"
    },
    items: [
      { id_pizza: 4, nombre: "Pizza Prosciutto e Funghi", cantidad: 1, precio_unitario: 235.00 }
    ],
    total_pizzas: 1,
    total_monto: 235.00,
    hora_recogida: "15:45",
    fecha: "2026-10-25",
    estado: "Listo"
  },
  {
    id_pedido: 100,
    cliente: {
      nombre: "Mariana Valdés",
      telefono: "5511223344"
    },
    items: [
      { id_pizza: 2, nombre: "Pizza Pepperoni Rustica", cantidad: 1, precio_unitario: 210.00 }
    ],
    total_pizzas: 1,
    total_monto: 210.00,
    hora_recogida: "15:15",
    fecha: "2026-10-25",
    estado: "Entregado"
  }
];

// Singleton en memoria global para preservar estado en Lambda container de Vercel y local
global.__ITALIANY_PIZZAS = global.__ITALIANY_PIZZAS || JSON.parse(JSON.stringify(seedPizzas));
global.__ITALIANY_PEDIDOS = global.__ITALIANY_PEDIDOS || JSON.parse(JSON.stringify(seedPedidos));

let nextPizzaId = 6;
let nextPedidoId = 104;

async function getDbConnection() {
  if (!process.env.MYSQL_URL && !process.env.MYSQL_HOST) {
    return null; // Usar fallback en memoria
  }
  try {
    const connection = await mysql.createConnection(
      process.env.MYSQL_URL || {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'italiany_pizzas',
        port: Number(process.env.MYSQL_PORT) || 3306,
        ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined
      }
    );
    return connection;
  } catch (err) {
    console.warn("No se pudo conectar a MySQL externo, utilizando almacén sincronizado en memoria:", err.message);
    return null;
  }
}

// Métodos para Pizzas (HU-01, HU-02)
async function getPizzas() {
  const db = await getDbConnection();
  if (db) {
    try {
      const [rows] = await db.query("SELECT id_pizza, nombre, descripcion, precio, TRUE as disponible FROM pizzas ORDER BY id_pizza ASC");
      await db.end();
      return rows;
    } catch (e) {
      console.error("Error MySQL pizzas, recurriendo a memoria:", e);
      try { await db.end(); } catch (_) {}
    }
  }
  return global.__ITALIANY_PIZZAS;
}

async function addPizza(pizzaData) {
  const precio = parseFloat(pizzaData.precio);
  if (isNaN(precio) || precio < 0) {
    throw new Error("El precio debe ser un número válido mayor o igual a 0.");
  }
  if (!pizzaData.nombre || !pizzaData.nombre.trim()) {
    throw new Error("El nombre de la pizza es obligatorio.");
  }
  if (!pizzaData.descripcion || !pizzaData.descripcion.trim()) {
    throw new Error("La descripción e ingredientes son obligatorios.");
  }

  const db = await getDbConnection();
  if (db) {
    try {
      const [result] = await db.query(
        "INSERT INTO pizzas (nombre, descripcion, precio) VALUES (?, ?, ?)",
        [pizzaData.nombre.trim(), pizzaData.descripcion.trim(), precio]
      );
      await db.end();
      const newPizza = {
        id_pizza: result.insertId,
        nombre: pizzaData.nombre.trim(),
        descripcion: pizzaData.descripcion.trim(),
        precio: precio,
        disponible: true
      };
      global.__ITALIANY_PIZZAS.push(newPizza);
      return newPizza;
    } catch (e) {
      console.error("Error al insertar pizza en MySQL:", e);
      try { await db.end(); } catch (_) {}
    }
  }

  const newPizza = {
    id_pizza: nextPizzaId++,
    nombre: pizzaData.nombre.trim(),
    descripcion: pizzaData.descripcion.trim(),
    precio: precio,
    disponible: true
  };
  global.__ITALIANY_PIZZAS.push(newPizza);
  return newPizza;
}

// Métodos para Pedidos (HU-03, HU-04, HU-05, HU-08, HU-09)
async function getPedidos() {
  return global.__ITALIANY_PEDIDOS;
}

async function createPedido(data) {
  // Validación de cliente
  if (!data.cliente || !data.cliente.nombre || !data.cliente.telefono) {
    throw new Error("Nombre y teléfono de cliente son obligatorios.");
  }
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("El pedido debe contener al menos una pizza seleccionada.");
  }

  // Validación de horario (3:00 PM a 10:00 PM = 15:00 a 22:00)
  const horaRecogida = data.hora_recogida || "18:00";
  const [hours] = horaRecogida.split(':').map(Number);
  if (hours < 15 || hours > 22) {
    throw new Error("El horario de recogida debe ser entre las 15:00 y las 22:00 hrs.");
  }

  // Cálculo de pizzas y totales
  let totalPizzas = 0;
  let totalMonto = 0;
  const itemsCalculados = data.items.map(item => {
    const cant = parseInt(item.cantidad, 10);
    const precio = parseFloat(item.precio_unitario);
    totalPizzas += cant;
    totalMonto += (cant * precio);
    return {
      id_pizza: item.id_pizza,
      nombre: item.nombre,
      cantidad: cant,
      precio_unitario: precio
    };
  });

  const nuevoPedido = {
    id_pedido: nextPedidoId++,
    cliente: {
      nombre: data.cliente.nombre.trim(),
      telefono: data.cliente.telefono.trim()
    },
    items: itemsCalculados,
    total_pizzas: totalPizzas,
    total_monto: parseFloat(totalMonto.toFixed(2)),
    hora_recogida: horaRecogida,
    fecha: new Date().toISOString().split('T')[0],
    estado: "Confirmado"
  };

  global.__ITALIANY_PEDIDOS.unshift(nuevoPedido);
  return nuevoPedido;
}

async function updateEstadoPedido(idPedido, nuevoEstado) {
  const estadosPermitidos = ['Confirmado', 'En preparación', 'Listo', 'Entregado'];
  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error(`Estado no válido. Debe ser uno de: ${estadosPermitidos.join(', ')}`);
  }

  const id = parseInt(idPedido, 10);
  const pedido = global.__ITALIANY_PEDIDOS.find(p => p.id_pedido === id);
  if (!pedido) {
    throw new Error(`Pedido #${id} no encontrado.`);
  }

  pedido.estado = nuevoEstado;
  return pedido;
}

module.exports = {
  getPizzas,
  addPizza,
  getPedidos,
  createPedido,
  updateEstadoPedido
};
