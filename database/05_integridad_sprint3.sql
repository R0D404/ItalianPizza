-- Italiany Pizzas - comprobaciones de integridad (Sprint 3)
USE italiany_pizzas;

-- 1) Detalles cuyo pedido no existe. Debe devolver 0 filas.
SELECT d.*
FROM detalle_pedido d
LEFT JOIN pedidos p ON p.id_pedido = d.id_pedido
WHERE p.id_pedido IS NULL;

-- 2) Detalles cuya pizza no existe. Debe devolver 0 filas.
SELECT d.*
FROM detalle_pedido d
LEFT JOIN pizzas pi ON pi.id_pizza = d.id_pizza
WHERE pi.id_pizza IS NULL;

-- 3) Pedidos cuyo cliente no existe. Debe devolver 0 filas.
SELECT p.*
FROM pedidos p
LEFT JOIN clientes c ON c.id_cliente = p.id_cliente
WHERE c.id_cliente IS NULL;

-- 4) Cantidades o precios inválidos. Debe devolver 0 filas.
SELECT *
FROM detalle_pedido
WHERE cantidad <= 0 OR precio_unitario < 0;

-- 5) Precios inválidos en el catálogo. Debe devolver 0 filas.
SELECT *
FROM pizzas
WHERE precio < 0;

-- 6) Estados fuera de los cuatro permitidos. Debe devolver 0 filas.
SELECT *
FROM pedidos
WHERE estado NOT IN ('Confirmado', 'En preparación', 'Listo', 'Entregado');

-- 7) Vista general para revisar que todas las relaciones funcionan.
SELECT
    p.id_pedido,
    c.nombre AS cliente,
    pi.nombre AS pizza,
    d.cantidad,
    d.precio_unitario,
    p.fecha_hora_recogida,
    p.estado
FROM pedidos p
INNER JOIN clientes c ON c.id_cliente = p.id_cliente
INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
INNER JOIN pizzas pi ON pi.id_pizza = d.id_pizza
ORDER BY p.id_pedido, d.id_detalle;
