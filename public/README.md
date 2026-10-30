# Italiany Pizzas — Módulo Frontend Completo (Sprints 1, 2 y 3)

**Universidad Politécnica de Chiapas**  
**Asignatura:** Análisis y Requerimientos de Software  
**Proyecto:** Sistema de pedidos para recoger en pizzería  
**Metodología:** Scrum  
**Periodo de Cierre:** 30 y 31 de octubre de 2026  

---

## 1. Organización de Vistas Separadas

El proyecto separa completamente las interfaces de usuario por módulo y actor en directorios independientes:

```text
italiany-pizzas-frontend/
│
├── index.html                           # Portal Central de Evaluación y Acceso a Vistas
│
├── css/
│   └── styles.css                       # Sistema de diseño unificado, responsive y sin frameworks
│
├── js/
│   └── data-store.js                    # Gestor de estado (catálogo, pedidos, 6 pizzas/h, LocalStorage)
│
├── vistas/
│   │
│   ├── cliente/                         # Módulo del Cliente
│   │   ├── index.html                   # Menú, selección de pizzas, cantidades, cliente y horario
│   │   ├── confirmacion.html            # Ticket de confirmación con folio generado y desglose
│   │   └── estado.html                  # Rastreo interactivo del pedido (stepper de 4 estados)
│   │
│   ├── cocina/                          # Módulo del Personal de Cocina
│   │   └── index.html                   # Monitor de comandas, carga de horno y actualización de estados
│   │
│   └── admin/                           # Módulo de Administración
│       └── index.html                   # Supervisión general de pedidos, KPIs y catálogo de pizzas
│
└── README.md                            # Guía de evaluación y matriz de requerimientos
```

---

## 2. Matriz de Cumplimiento de Requerimientos (Sprints 1, 2 y 3)

| Sprint | Requerimiento Oficial | Implementación en Frontend |
| :--- | :--- | :--- |
| **Sprint 1** | • Menú con nombre, ingredientes y precio.<br>• Formulario visual de cliente.<br>• Vistas iniciales de cocina y administrador.<br>• Tablas SQL y pizzas de prueba. | Implementado en `vistas/cliente/index.html` con tarjetas responsivas, precios, descripciones y formulario con validación nativa. Vistas preparatorias de cocina y admin creadas. |
| **Sprint 2** | • Selección de pizzas y cantidades.<br>• Registro del cliente y pedido.<br>• Selección de horario de recogida (15:00 a 22:00).<br>• **Validación de capacidad de 6 pizzas/hora**.<br>• **Propuesta de horarios alternativos**.<br>• Lista de pedidos en cocina.<br>• **Actualización de estados**. | Implementado con botones `(+)` y `(-)` en cada pizza. Si el usuario intenta pedir más de la capacidad disponible para esa hora, el sistema bloquea el envío y muestra botones interactivos con los **horarios alternativos recomendados**. En cocina, se actualiza el estado en 1 clic. |
| **Sprint 3** | • **Confirmación del pedido**.<br>• **Consulta de estado por el cliente**.<br>• **Supervisión de pedidos en administración**.<br>• Integración de Cliente, Cocina y Administrador. | Vista `confirmacion.html` con folio y ticket completo. Vista `estado.html` con barra de progreso de 4 estados (`Confirmado` &rarr; `En preparación` &rarr; `Listo` &rarr; `Entregado`). Vista `admin/index.html` con KPIs gerenciales y altas al catálogo. |

---

## 3. Guía de Demostración para Evaluación

1. **Abrir el Portal:**
   - Abre `index.html` en tu navegador.
2. **Hacer un pedido como Cliente:**
   - Haz clic en **1. Cliente: Menú y Pedido** (`vistas/cliente/index.html`).
   - Elige pizzas y cantidades con los botones `(+)`.
   - Selecciona un horario (ej. 16:00 hrs). Si agregas 5 pizzas, verás cómo se activa la alerta de límite de 6 pizzas/hora y te propone horarios alternativos como 18:00 hrs.
   - Ingresa nombre y teléfono, y presiona **Confirmar y Enviar Pedido**.
3. **Ver Confirmación:**
   - Verás el ticket en `confirmacion.html` con el folio generado (ej. `#PED-104`).
4. **Ver y Actualizar en Cocina:**
   - Abre **Vista Cocina** (`vistas/cocina/index.html`). El pedido recién creado ya aparece en la lista con estado *Confirmado*.
   - Haz clic en **🔥 Iniciar Horno** (pasa a *En preparación*), luego **✅ Marcar Listo** (pasa a *Listo*).
5. **Rastrear como Cliente:**
   - Abre **Rastreo Cliente** (`vistas/cliente/estado.html`). Ingresa el folio `#PED-104` o tu teléfono. Observa cómo el stepper visual refleja el estado que avanzó la cocina.
6. **Supervisar en Administración:**
   - Abre **Vista Admin** (`vistas/admin/index.html`). Verás las métricas actualizadas y podrás registrar una nueva pizza que se añadirá de inmediato al menú del cliente.
