-- Italiany Pizzas - datos de prueba del Sprint 1
USE italiany_pizzas;

INSERT INTO pizzas (nombre, descripcion, precio) VALUES
('Margarita', 'Salsa de tomate, queso mozzarella y albahaca', 120.00),
('Pepperoni', 'Salsa de tomate, queso mozzarella y pepperoni', 145.00),
('Hawaiana', 'Salsa de tomate, queso mozzarella, jamón y piña', 150.00);

-- Consulta de comprobación requerida para el menú.
SELECT id_pizza, nombre, descripcion, precio
FROM pizzas
ORDER BY id_pizza;
