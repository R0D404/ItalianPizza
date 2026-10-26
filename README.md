# 🍕 Italiany Pizzas — Proyecto Fullstack Unificado (Sprint 1)

Sistema web completo e integrado para la pizzería **Italiany Pizzas**, correspondiente a las historias de usuario del **Sprint 1: Estructura y Menú** de la materia de *Análisis y Diseño de Software* (UPChiapas).

---

## 🎯 Alcance del Sprint 1 implementado y conectado

| ID Historia | Rol / Funcionalidad | Estado de Integración |
| :--- | :--- | :---: |
| **HU-01** | Como administrador, registrar y editar pizzas en el catálogo. | Conectado con `/api/pizzas` y tabla `pizzas`. Sincronizado en tiempo real. |
| **HU-02** | Como cliente, consultar pizzas, precios e ingredientes. | Conectado vía fetch API reactivo al catálogo de la base de datos. |
| **HU-03** | Como cliente, seleccionar pizzas, modificar cantidades y calcular subtotal. | Carrito interactivo con botones `+` y `-`, cálculo automático de subtotal monetario. |
| **HU-04** | Como cliente, indicar nombre y teléfono de contacto con validaciones. | Formulario con validación nativa (expresiones regulares, campos obligatorios). |
| **HU-05 & HU-08/09** | Enviar pedido a cocina y monitor de preparación en tiempo real. | Conectado con `/api/pedidos` para cambiar estados (`Confirmado` ➔ `En preparación` ➔ `Listo` ➔ `Entregado`). |

---

## 📂 Estructura del Proyecto

```text
italiany-pizzas-fullstack/
│
├── api/                        # Funciones Serverless listas para Vercel
│   ├── db.js                   # Capa de datos (MySQL / Almacén en Memoria de alta velocidad)
│   ├── pizzas.js               # Endpoint REST GET y POST para pizzas (/api/pizzas)
│   └── pedidos.js              # Endpoint REST GET, POST y PATCH para pedidos (/api/pedidos)
│
├── public/                     # Frontend estático servido directamente por Vercel
│   ├── index.html              # Vista Cliente: Menú, Carrito y Formulario de Contacto
│   ├── cocina.html             # Vista Cocina: Monitor de comandas en vivo
│   ├── admin.html              # Vista Admin: Registro de pizzas y tabla de catálogo
│   ├── css/
│   │   └── styles.css          # Sistema de diseño italiano unificado
│   └── js/
│       ├── client.js           # Lógica interactiva del cliente y pedidos
│       ├── admin.js            # Lógica de administración y registro de pizzas
│       └── cocina.js           # Lógica del monitor de cocina y cambio de estados
│
├── database/                   # Scripts SQL entregados por el equipo de Base de Datos
│   ├── 01_schema.sql           # Estructura de tablas (pizzas, clientes, pedidos, detalle_pedido)
│   ├── 02_seed.sql             # Catálogo inicial de pizzas
│   ├── 03_pedidos_prueba_sprint2.sql
│   ├── 04_consultas_cocina_sprint2.sql
│   ├── 05_integridad_sprint3.sql
│   ├── diagrama_mermaid.mmd
│   └── diagrama_dbdiagram.dbml
│
├── vercel.json                 # Configuración de despliegue en Vercel
├── package.json                # Dependencias y scripts
├── server.js                   # Servidor local Node.js para pruebas sin internet
└── README.md                   # Esta documentación
```

---

## 🚀 Cómo desplegar en Vercel (Paso a Paso)

Este proyecto está optimizado con arquitectura **Vercel Serverless Functions + Static Hosting**, lo que permite desplegarlo completamente gratis y en 1 minuto.

### Opción A: Despliegue desde GitHub / GitLab (Recomendado)
1. Sube esta carpeta `italiany-pizzas-fullstack` a tu repositorio en GitHub.
2. Inicia sesión en [Vercel](https://vercel.com).
3. Haz clic en **"Add New..."** ➔ **"Project"**.
4. Importa tu repositorio.
5. Vercel detectará automáticamente `vercel.json` y la carpeta `api/`.
6. Haz clic en **"Deploy"**. ¡Listo! Tendrás un enlace público `https://tu-proyecto.vercel.app`.

### Opción B: Despliegue usando Vercel CLI
En tu terminal:
```bash
npm install -g vercel
cd /home/rod404/Descargas/Rocio/Pizza/italiany-pizzas-fullstack
vercel
```

---

## 💻 Cómo ejecutar en local

Para ejecutar y probar el proyecto en tu máquina:

```bash
cd /home/rod404/Descargas/Rocio/Pizza/italiany-pizzas-fullstack
npm start
```
Luego abre en tu navegador:
- Menú Cliente: **`http://localhost:3000/`**
- Panel Administración: **`http://localhost:3000/admin.html`**
- Monitor de Cocina: **`http://localhost:3000/cocina.html`**
