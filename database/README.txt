ITALIANY PIZZAS - BASE DE DATOS

Contenido:
1. 01_schema.sql
   Crea la base italiany_pizzas y las tablas pizzas, clientes, pedidos y detalle_pedido.

2. 02_seed.sql
   Inserta pizzas de prueba.

3. 03_pedidos_prueba_sprint2.sql
   Inserta clientes, pedidos y detalles de ejemplo para probar el Sprint 2.

4. 04_consultas_cocina_sprint2.sql
   Consultas del menu, pedidos para cocina, estados, totales y pizzas reservadas por hora.

5. 05_integridad_sprint3.sql
   Consultas para comprobar integridad y detectar problemas de datos.

6. diagrama_dbdiagram.dbml
   Codigo listo para pegar en https://dbdiagram.io
   En dbdiagram.io: New Diagram -> borrar el ejemplo -> pegar todo el contenido del archivo.

7. diagrama_mermaid.mmd
   Version del mismo diagrama en Mermaid.

Orden recomendado para probar en MySQL 8:
01_schema.sql -> 02_seed.sql -> 03_pedidos_prueba_sprint2.sql -> 04_consultas_cocina_sprint2.sql -> 05_integridad_sprint3.sql

Relaciones:
CLIENTES 1 ---- N PEDIDOS
PEDIDOS  1 ---- N DETALLE_PEDIDO
PIZZAS   1 ---- N DETALLE_PEDIDO
