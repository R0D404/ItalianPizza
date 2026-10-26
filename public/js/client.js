// ==========================================================================
// ITALIANY PIZZAS - LÓGICA DE CLIENTE Y CARRITO DE PEDIDOS (SPRINT 1)
// Criterios: HU-02 (Consultar menú), HU-03 (Seleccionar y subtotal), HU-04 (Nombre y teléfono)
// ==========================================================================

const API_BASE = '/api';

// Estado de la aplicación en el cliente
let catalogoPizzas = [];
let carrito = {}; // { id_pizza: { pizza, cantidad } }

document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
    configurarFormulario();
});

// Cargar catálogo desde la API /api/pizzas (conecta BD y Backend con Frontend)
async function cargarCatalogo() {
    const grid = document.getElementById('pizza-grid');
    if (!grid) return;

    try {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">Cargando especialidades italianas del horno... 🍕</div>';
        
        const res = await fetch(`${API_BASE}/pizzas`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        catalogoPizzas = await res.json();
        renderizarCatalogo(catalogoPizzas);
    } catch (err) {
        console.error("Error al cargar pizzas:", err);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #ffebee; color: #c62828; border-radius: 8px;">
                <p><strong>No se pudo conectar con el catálogo de pizzas.</strong></p>
                <p style="font-size: 0.9rem;">Verifica la conexión con el servidor o base de datos.</p>
            </div>
        `;
    }
}

// Renderizar tarjetas de pizzas con selector de cantidad (HU-02 y HU-03)
function renderizarCatalogo(pizzas) {
    const grid = document.getElementById('pizza-grid');
    if (!grid) return;

    if (!pizzas || pizzas.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No hay pizzas disponibles en el menú hoy.</div>';
        return;
    }

    grid.innerHTML = pizzas.map(pizza => {
        const id = pizza.id_pizza || pizza.id;
        const precio = parseFloat(pizza.precio).toFixed(2);
        const cantActual = (carrito[id] && carrito[id].cantidad) || 0;

        return `
        <article class="pizza-card" data-id="${id}">
            <div class="pizza-card-header">
                <span class="pizza-badge available">${pizza.disponible !== false ? 'Disponible' : 'Agotada'}</span>
                <span class="pizza-id">#${String(id).padStart(2, '0')}</span>
            </div>
            <div class="pizza-card-body">
                <h4 class="pizza-name">${escapeHTML(pizza.nombre)}</h4>
                <p class="pizza-ingredients">
                    ${escapeHTML(pizza.descripcion || pizza.ingredientes || '')}
                </p>
            </div>
            <div class="pizza-card-footer">
                <div class="pizza-price-container">
                    <span class="price-label">Precio</span>
                    <span class="pizza-price">$${precio} MXN</span>
                </div>
                
                <div class="pizza-cart-control" style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
                    <button type="button" class="btn btn-sm btn-outline-secondary" onclick="modificarCantidad(${id}, -1)" title="Disminuir">-</button>
                    <span id="cant-pizza-${id}" style="font-weight: bold; min-width: 20px; text-align: center;">${cantActual}</span>
                    <button type="button" class="btn btn-sm btn-primary" onclick="modificarCantidad(${id}, 1)" title="Agregar">+</button>
                </div>
            </div>
        </article>
        `;
    }).join('');
}

// Modificar cantidad y recalcular subtotal (HU-03)
window.modificarCantidad = function(idPizza, cambio) {
    const pizza = catalogoPizzas.find(p => (p.id_pizza || p.id) == idPizza);
    if (!pizza) return;

    if (!carrito[idPizza]) {
        carrito[idPizza] = {
            pizza: pizza,
            cantidad: 0
        };
    }

    carrito[idPizza].cantidad += cambio;

    if (carrito[idPizza].cantidad <= 0) {
        delete carrito[idPizza];
    }

    // Actualizar contador visual en la tarjeta
    const el = document.getElementById(`cant-pizza-${idPizza}`);
    if (el) {
        el.innerText = carrito[idPizza] ? carrito[idPizza].cantidad : 0;
    }

    actualizarResumenPedido();
};

// Actualizar panel de resumen y subtotal
function actualizarResumenPedido() {
    const contenedorResumen = document.getElementById('resumen-pedido');
    const items = Object.values(carrito);
    
    let subtotal = 0;
    let totalPizzas = 0;

    items.forEach(item => {
        subtotal += item.cantidad * parseFloat(item.pizza.precio);
        totalPizzas += item.cantidad;
    });

    if (contenedorResumen) {
        if (totalPizzas === 0) {
            contenedorResumen.innerHTML = `
                <div class="cart-empty-message" style="text-align: center; color: var(--color-text-muted); padding: 1.5rem;">
                    🍕 Aún no has seleccionado ninguna pizza. Elige tus favoritas arriba con el botón (+).
                </div>
            `;
        } else {
            const listHtml = items.map(i => `
                <li style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--color-border);">
                    <span>${escapeHTML(i.pizza.nombre)} <strong>x${i.cantidad}</strong></span>
                    <span>$${(i.cantidad * parseFloat(i.pizza.precio)).toFixed(2)}</span>
                </li>
            `).join('');

            contenedorResumen.innerHTML = `
                <div style="background: var(--color-bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.75rem; color: var(--color-primary);">Tu Selección Actual (${totalPizzas} pizzas)</h4>
                    <ul style="margin-bottom: 1rem;">${listHtml}</ul>
                    <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; border-top: 2px solid var(--color-border); padding-top: 0.75rem;">
                        <span>Subtotal a Pagar:</span>
                        <span style="color: var(--color-secondary);">$${subtotal.toFixed(2)} MXN</span>
                    </div>
                </div>
            `;
        }
    }

    // Actualizar indicador en botón de enviar
    const btnSubmit = document.getElementById('btn-guardar-pedido');
    if (btnSubmit) {
        btnSubmit.disabled = (totalPizzas === 0);
    }
}

// Configurar formulario de cliente (HU-04, HU-05)
function configurarFormulario() {
    const form = document.getElementById('form-cliente');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('cliente-nombre').value.trim();
        const telefono = document.getElementById('cliente-telefono').value.trim();
        const horaRecogida = document.getElementById('hora-recogida') ? document.getElementById('hora-recogida').value : '18:00';

        if (!nombre || !telefono) {
            alert("Por favor completa tu nombre y teléfono para identificar tu pedido.");
            return;
        }

        const itemsSeleccionados = Object.values(carrito).map(i => ({
            id_pizza: i.pizza.id_pizza || i.pizza.id,
            nombre: i.pizza.nombre,
            cantidad: i.cantidad,
            precio_unitario: i.pizza.precio
        }));

        if (itemsSeleccionados.length === 0) {
            alert("Selecciona al menos una pizza en el menú antes de registrar tu pedido.");
            return;
        }

        const payload = {
            cliente: {
                nombre: nombre,
                telefono: telefono
            },
            hora_recogida: horaRecogida,
            items: itemsSeleccionados
        };

        const btn = document.getElementById('btn-guardar-pedido');
        if (btn) btn.disabled = true;

        try {
            const res = await fetch(`${API_BASE}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al procesar el pedido');

            mostrarConfirmacionModal(data.pedido);

            // Reiniciar carrito y formulario
            carrito = {};
            form.reset();
            actualizarResumenPedido();
            cargarCatalogo();

        } catch (err) {
            alert("Error al registrar pedido: " + err.message);
        } finally {
            if (btn) btn.disabled = false;
        }
    });
}

function mostrarConfirmacionModal(pedido) {
    const modalId = 'modal-confirmacion-pedido';
    let modal = document.getElementById(modalId);
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 24px; max-width: 500px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🎉🍕</div>
            <h3 style="color: var(--color-primary); margin-bottom: 8px;">¡Pedido Recibido con Éxito!</h3>
            <p style="color: var(--color-text-muted); margin-bottom: 16px;">Tu orden ha sido enviada a la cocina.</p>
            
            <div style="background: var(--color-bg-body); padding: 15px; border-radius: 8px; text-align: left; margin-bottom: 20px;">
                <p><strong>Folio:</strong> #PED-${pedido.id_pedido}</p>
                <p><strong>Cliente:</strong> ${escapeHTML(pedido.cliente.nombre)}</p>
                <p><strong>Hora de recogida:</strong> ${pedido.hora_recogida} hrs</p>
                <p><strong>Total a pagar:</strong> $${pedido.total_monto.toFixed(2)} MXN</p>
                <p><strong>Estado:</strong> <span class="badge badge-confirmado">${pedido.estado}</span></p>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="cocina.html" class="btn btn-secondary">Ver en Cocina</a>
                <button type="button" class="btn btn-primary" onclick="document.getElementById('${modalId}').remove()">Aceptar</button>
            </div>
        </div>
    `;
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
