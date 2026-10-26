// ==========================================================================
// ITALIANY PIZZAS - ADMINISTRACIÓN DEL CATÁLOGO (HU-01)
// Permite registrar y consultar pizzas sincronizadas con la API
// ==========================================================================

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    cargarTablaPizzas();
    configurarFormularioAdmin();
});

async function cargarTablaPizzas() {
    const tbody = document.getElementById('admin-pizzas-tbody');
    const badgeCount = document.getElementById('admin-total-badge');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 2rem;">Cargando catálogo desde el servidor...</td></tr>';
        const res = await fetch(`${API_BASE}/pizzas`);
        if (!res.ok) throw new Error("Error en servidor");
        const pizzas = await res.json();

        if (badgeCount) badgeCount.innerText = `${pizzas.length} registradas`;

        if (pizzas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 2rem;">No hay pizzas registradas aún. Registra una con el formulario.</td></tr>';
            return;
        }

        tbody.innerHTML = pizzas.map(pizza => {
            const id = pizza.id_pizza || pizza.id;
            const precio = parseFloat(pizza.precio).toFixed(2);
            return `
            <tr>
                <td class="font-bold text-center">#${String(id).padStart(2, '0')}</td>
                <td><strong>${escapeHTML(pizza.nombre)}</strong></td>
                <td>${escapeHTML(pizza.descripcion || pizza.ingredientes || '')}</td>
                <td class="text-right font-bold">$${precio}</td>
                <td class="text-center">
                    <span class="badge ${pizza.disponible !== false ? 'badge-disponible' : 'badge-agotada'}">
                        ${pizza.disponible !== false ? 'Disponible' : 'Agotada'}
                    </span>
                </td>
            </tr>
            `;
        }).join('');

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: red; padding: 2rem;">Error al cargar catálogo: ${err.message}</td></tr>`;
    }
}

function configurarFormularioAdmin() {
    const form = document.getElementById('form-nueva-pizza');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('pizza-nombre').value.trim();
        const descripcion = document.getElementById('pizza-descripcion').value.trim();
        const precio = parseFloat(document.getElementById('pizza-precio').value);

        if (!nombre || !descripcion || isNaN(precio)) {
            alert("Por favor completa todos los campos requeridos.");
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;

        try {
            const res = await fetch(`${API_BASE}/pizzas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion, precio })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar pizza');

            alert(`✅ ${data.mensaje || 'Pizza registrada con éxito'}`);
            form.reset();
            cargarTablaPizzas();

        } catch (err) {
            alert("Error al registrar pizza: " + err.message);
        } finally {
            if (btn) btn.disabled = false;
        }
    });
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
