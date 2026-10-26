// ==========================================================================
// ITALIANY PIZZAS - MONITOR DE COCINA (HU-08, HU-09)
// Permite visualizar comandas y actualizar estados: Confirmado -> En preparación -> Listo -> Entregado
// ==========================================================================

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosCocina();
    // Auto-refresco cada 10 segundos
    setInterval(cargarPedidosCocina, 10000);
});

async function cargarPedidosCocina() {
    const tbody = document.getElementById('pedidos-cocina-tbody');
    const cardsContainer = document.getElementById('pedidos-cocina-cards');
    const badgeActivos = document.getElementById('pedidos-activos-badge');

    try {
        const res = await fetch(`${API_BASE}/pedidos`);
        if (!res.ok) throw new Error("Error al obtener pedidos");
        const pedidos = await res.json();

        const activos = pedidos.filter(p => p.estado !== 'Entregado').length;
        if (badgeActivos) badgeActivos.innerText = `${activos} activos`;

        renderizarTablaCocina(pedidos, tbody);
        renderizarCardsCocina(pedidos, cardsContainer);

    } catch (err) {
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: red; padding: 2rem;">Error al sincronizar con cocina: ${err.message}</td></tr>`;
        }
    }
}

function renderizarTablaCocina(pedidos, tbody) {
    if (!tbody) return;

    if (!pedidos || pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">No hay pedidos registrados en cocina.</td></tr>';
        return;
    }

    tbody.innerHTML = pedidos.map(p => {
        const estadoClase = obtenerClaseEstado(p.estado);
        const botonesAccion = renderizarBotonesAccion(p);
        const listaItems = (p.items || []).map(i => `<li>${escapeHTML(i.nombre)} (<strong>${i.cantidad}</strong>)</li>`).join('');

        return `
        <tr class="${p.estado === 'Entregado' ? 'row-muted' : ''}">
            <td class="font-bold">#PED-${p.id_pedido}</td>
            <td>
                <strong>${escapeHTML(p.cliente.nombre)}</strong>
                <div class="text-muted text-sm">Tel: ${escapeHTML(p.cliente.telefono)}</div>
            </td>
            <td>
                <ul class="order-pizza-list">${listaItems}</ul>
            </td>
            <td class="font-bold text-center">${p.total_pizzas || 0}</td>
            <td><span class="time-badge">${p.hora_recogida || '18:00'} hrs</span></td>
            <td><span class="badge ${estadoClase}">${p.estado}</span></td>
            <td>
                <div class="table-actions">
                    ${botonesAccion}
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

function renderizarCardsCocina(pedidos, container) {
    if (!container) return;

    if (!pedidos || pedidos.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">No hay pedidos en cola.</div>';
        return;
    }

    container.innerHTML = pedidos.map(p => {
        const estadoClase = obtenerClaseEstado(p.estado);
        const botonesAccion = renderizarBotonesAccion(p);
        const resumenPizzas = (p.items || []).map(i => `${escapeHTML(i.nombre)} (${i.cantidad})`).join(', ');

        return `
        <article class="order-card-mobile ${p.estado === 'Entregado' ? 'row-muted' : ''}">
            <div class="card-mobile-header">
                <span class="font-bold">#PED-${p.id_pedido}</span>
                <span class="badge ${estadoClase}">${p.estado}</span>
            </div>
            <div class="card-mobile-body">
                <p><strong>Cliente:</strong> ${escapeHTML(p.cliente.nombre)} (Tel: ${escapeHTML(p.cliente.telefono)})</p>
                <p><strong>Pizzas:</strong> ${resumenPizzas}</p>
                <p><strong>Cantidad total:</strong> ${p.total_pizzas} pizzas</p>
                <p><strong>Hora recogida:</strong> ${p.hora_recogida} hrs</p>
            </div>
            <div class="card-mobile-footer">
                ${botonesAccion}
            </div>
        </article>
        `;
    }).join('');
}

function obtenerClaseEstado(estado) {
    switch (estado) {
        case 'Confirmado': return 'badge-confirmado';
        case 'En preparación': return 'badge-preparacion';
        case 'Listo': return 'badge-listo';
        case 'Entregado': return 'badge-entregado';
        default: return 'badge-secondary';
    }
}

function renderizarBotonesAccion(pedido) {
    const id = pedido.id_pedido;
    switch (pedido.estado) {
        case 'Confirmado':
            return `<button type="button" class="btn btn-sm btn-outline-primary" onclick="cambiarEstado(${id}, 'En preparación')">Comenzar</button>`;
        case 'En preparación':
            return `<button type="button" class="btn btn-sm btn-outline-success" onclick="cambiarEstado(${id}, 'Listo')">Marcar Listo</button>`;
        case 'Listo':
            return `<button type="button" class="btn btn-sm btn-outline-secondary" onclick="cambiarEstado(${id}, 'Entregado')">Entregar</button>`;
        case 'Entregado':
            return `<span class="text-sm text-muted">Completado</span>`;
        default:
            return '';
    }
}

window.cambiarEstado = async function(idPedido, nuevoEstado) {
    try {
        const res = await fetch(`${API_BASE}/pedidos`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_pedido: idPedido, estado: nuevoEstado })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al actualizar');

        cargarPedidosCocina();
    } catch (err) {
        alert("Error al actualizar estado: " + err.message);
    }
};

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
