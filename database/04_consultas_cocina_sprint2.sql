-- Italiany Pizzas - consultas para cocina (Sprint 2)
USE italiany_pizzas;

-- 1) Menú completo para Backend 1 / Frontend 1.
SELECT id_pizza, nombre, descripcion, precio
FROM pizzas
ORDER BY nombre;

-- 2) Pedidos para cocina: cliente, pizza, cantidad, hora y estado.
SELECT
    p.id_pedido,
    c.nombre AS cliente,
    c.telefono,
    pi.nombre AS pizza,
    d.cantidad,
    p.fecha_hora_recogida,
    p.estado
FROM pedidos p
INNER JOIN clientes c ON c.id_cliente = p.id_cliente
INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
INNER JOIN pizzas pi ON pi.id_pizza = d.id_pizza
ORDER BY p.fecha_hora_recogida, p.id_pedido, d.id_detalle;

-- 3) Pedidos que todavía requieren atención en cocina.
SELECT
    p.id_pedido,
    c.nombre AS cliente,
    p.fecha_hora_recogida,
    p.estado
FROM pedidos p
INNER JOIN clientes c ON c.id_cliente = p.id_cliente
WHERE p.estado IN ('Confirmado', 'En preparación', 'Listo')
ORDER BY p.fecha_hora_recogida;

-- 4) Detalle y total monetario de cada pedido.
SELECT
    p.id_pedido,
    c.nombre AS cliente,
    SUM(d.cantidad) AS total_pizzas,
    SUM(d.cantidad * d.precio_unitario) AS total_pedido,
    p.fecha_hora_recogida,
    p.estado
FROM pedidos p
INNER JOIN clientes c ON c.id_cliente = p.id_cliente
INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
GROUP BY p.id_pedido, c.nombre, p.fecha_hora_recogida, p.estado
ORDER BY p.fecha_hora_recogida;

-- 5) Cantidad de pizzas reservadas por hora.
-- Esta consulta entrega la información que Backend 2 puede usar para
-- validar la regla de máximo 6 pizzas por hora.
SELECT
    DATE(fecha_hora_recogida) AS fecha,
    HOUR(fecha_hora_recogida) AS hora,
    SUM(d.cantidad) AS pizzas_reservadas
FROM pedidos p
INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
WHERE p.estado <> 'Entregado'
GROUP BY DATE(fecha_hora_recogida), HOUR(fecha_hora_recogida)
ORDER BY fecha, hora;

-- 6) Ejemplo: pedidos de una fecha específica.
SELECT
    p.id_pedido,
    c.nombre AS cliente,
    p.fecha_hora_recogida,
    p.estado
FROM pedidos p
INNER JOIN clientes c ON c.id_cliente = p.id_cliente
WHERE DATE(p.fecha_hora_recogida) = '2026-10-25'
ORDER BY p.fecha_hora_recogida;
