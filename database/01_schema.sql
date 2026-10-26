-- Italiany Pizzas - Base de Datos
-- Sprint 1: estructura inicial
-- Versión preparada para MySQL 8.x

CREATE DATABASE IF NOT EXISTS italiany_pizzas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE italiany_pizzas;

DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS pizzas;

CREATE TABLE pizzas (
    id_pizza INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_pizzas_precio CHECK (precio >= 0)
);

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    telefono VARCHAR(30) NOT NULL
);

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_hora_recogida DATETIME NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'Confirmado',
    CONSTRAINT fk_pedidos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente),
    CONSTRAINT chk_pedidos_estado
        CHECK (estado IN ('Confirmado', 'En preparación', 'Listo', 'Entregado'))
);

CREATE TABLE detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_pizza INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido),
    CONSTRAINT fk_detalle_pizza
        FOREIGN KEY (id_pizza)
        REFERENCES pizzas(id_pizza),
    CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detalle_precio CHECK (precio_unitario >= 0)
);

-- Índices útiles para las consultas de cocina del Sprint 2.
CREATE INDEX idx_pedidos_fecha_hora ON pedidos(fecha_hora_recogida);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_detalle_id_pedido ON detalle_pedido(id_pedido);
CREATE INDEX idx_detalle_id_pizza ON detalle_pedido(id_pizza);
