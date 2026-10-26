const { getPedidos, createPedido, updateEstadoPedido } = require('./db');

module.exports = async (req, res) => {
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
      const pedidos = await getPedidos();
      return res.status(200).json(pedidos);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const nuevoPedido = await createPedido(body);
      return res.status(201).json({
        success: true,
        mensaje: "Pedido registrado exitosamente para preparación",
        pedido: nuevoPedido
      });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id_pedido, estado } = body;
      const pedidoActualizado = await updateEstadoPedido(id_pedido, estado);
      return res.status(200).json({
        success: true,
        mensaje: `Pedido #${id_pedido} actualizado a ${estado}`,
        pedido: pedidoActualizado
      });
    }

    return res.status(405).json({ error: `Método ${req.method} no permitido.` });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error en el servidor' });
  }
};
