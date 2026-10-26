const { getPizzas, addPizza } = require('./db');

module.exports = async (req, res) => {
  // Configuración de cabeceras CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const pizzas = await getPizzas();
      return res.status(200).json(pizzas);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const nuevaPizza = await addPizza(body);
      return res.status(201).json({
        success: true,
        mensaje: "Pizza registrada correctamente en el catálogo",
        pizza: nuevaPizza
      });
    }

    return res.status(405).json({ error: `Método ${req.method} no permitido.` });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error en el servidor' });
  }
};
