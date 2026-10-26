-- Italiany Pizzas - ejemplos para Sprint 2
-- Guardar pedidos y horarios para poder probar las consultas de cocina.
USE italiany_pizzas;

INSERT INTO clientes (nombre, telefono) VALUES
('Ana López', '9611234567'),
('Carlos Méndez', '9617654321');

INSERT INTO pedidos (id_cliente, fecha_hora_recogida, estado) VALUES
(1, '2026-10-25 18:00:00', 'Confirmado'),
(2, '2026-10-25 19:00:00', 'En preparación');

INSERT INTO detalle_pedido (id_pedido, id_pizza, cantidad, precio_unitario) VALUES
(1, 1, 2, 120.00),
(1, 2, 1, 145.00),
(2, 3, 2, 150.00);
