/**
 * ITALIANY PIZZAS - DATA STORE & GESTOR DE ESTADO (LOCALSTORAGE)
 * Proyecto: Sistema de pedidos para recoger en pizzería
 * Universidad Politécnica de Chiapas · Sprint 1, 2 y 3
 * 
 * Implementa de forma integral y desacoplada:
 * - Catálogo de pizzas sincronizado con esquema SQL
 * - Registro y supervisión de pedidos
 * - Validación de horario (15:00 a 22:00) y regla de negocio: Máximo 6 pizzas por hora
 * - Sugerencia automática de horarios alternativos disponibles
 * - Ciclo de vida de estados: Confirmado -> En preparación -> Listo -> Entregado
 */

const STORAGE_KEYS = {
    PIZZAS: 'italiany_pizzas_catalog',
    PEDIDOS: 'italiany_pedidos_list',
    ULTIMO_PEDIDO: 'italiany_ultimo_pedido_id'
};

// Horarios de atención oficiales: 15:00 a 22:00 hrs
const HORARIOS_DISPONIBLES = [
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const LIMITE_PIZZAS_POR_HORA = 6;

// Catálogo base de prueba alineado con seed.sql
const DEFAULT_PIZZAS = [
    {
        id: 1,
        nombre: "Pizza Margherita Tradizionale",
        descripcion: "Salsa de tomate San Marzano artesanal, mozzarella fresca di bufala, albahaca fresca del huerto y aceite de oliva virgen extra.",
        precio: 180.00,
        disponible: true
    },
    {
        id: 2,
        nombre: "Pizza Pepperoni Rustica",
        descripcion: "Salsa de tomate casera, generosa capa de queso mozzarella derretido y rodajas de pepperoni premium curado al horno.",
        precio: 210.00,
        disponible: true
    },
    {
        id: 3,
        nombre: "Pizza Quattro Formaggi",
        descripcion: "Base blanca cremosa, combinación de mozzarella, gorgonzola curado, parmesano reggiano rallado y provolone fundido.",
        precio: 240.00,
        disponible: true
    },
    {
        id: 4,
        nombre: "Pizza Prosciutto e Funghi",
        descripcion: "Salsa pomodoro especial, queso mozzarella, jamón prosciutto italiano en láminas delgadas y champiñones salteados al ajo.",
        precio: 235.00,
        disponible: true
    }
];

// Pedidos base ilustrativos para pruebas inmediatas de cocina y capacidad
const DEFAULT_PEDIDOS = [
    {
        id: "PED-101",
        cliente: "Carlos Mendoza",
        telefono: "5543219876",
        pizzas: [
            { id: 1, nombre: "Margherita Tradizionale", cantidad: 1, precio: 180.00 },
            { id: 2, nombre: "Pepperoni Rustica", cantidad: 1, precio: 210.00 }
        ],
        total_pizzas: 2,
        total_monto: 390.00,
        hora_recogida: "16:00",
        estado: "En preparación",
        fecha: "2026-10-30"
    },
    {
        id: "PED-102",
        cliente: "Lucía Fernanda Soto",
        telefono: "5598761234",
        pizzas: [
            { id: 3, nombre: "Quattro Formaggi", cantidad: 2, precio: 240.00 }
        ],
        total_pizzas: 2,
        total_monto: 480.00,
        hora_recogida: "17:00",
        estado: "Confirmado",
        fecha: "2026-10-30"
    },
    {
        id: "PED-103",
        cliente: "Roberto Garza",
        telefono: "5567894321",
        pizzas: [
            { id: 4, nombre: "Prosciutto e Funghi", cantidad: 1, precio: 235.00 }
        ],
        total_pizzas: 1,
        total_monto: 235.00,
        hora_recogida: "15:00",
        estado: "Listo",
        fecha: "2026-10-30"
    },
    {
        id: "PED-100",
        cliente: "Mariana Valdés",
        telefono: "5511223344",
        pizzas: [
            { id: 2, nombre: "Pepperoni Rustica", cantidad: 1, precio: 210.00 }
        ],
        total_pizzas: 1,
        total_monto: 210.00,
        hora_recogida: "15:00",
        estado: "Entregado",
        fecha: "2026-10-30"
    }
];

const ItalianyStore = {
    // Inicialización de datos en localStorage
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.PIZZAS)) {
            localStorage.setItem(STORAGE_KEYS.PIZZAS, JSON.stringify(DEFAULT_PIZZAS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.PEDIDOS)) {
            localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(DEFAULT_PEDIDOS));
        }
    },

    // Reiniciar a datos por defecto si se desea probar desde cero
    resetDefaults() {
        localStorage.setItem(STORAGE_KEYS.PIZZAS, JSON.stringify(DEFAULT_PIZZAS));
        localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(DEFAULT_PEDIDOS));
        localStorage.removeItem(STORAGE_KEYS.ULTIMO_PEDIDO);
    },

    // --- MÉTODOS DE CATÁLOGO DE PIZZAS ---
    getPizzas() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.PIZZAS)) || DEFAULT_PIZZAS;
        } catch (e) {
            return DEFAULT_PIZZAS;
        }
    },

    addPizza(pizzaData) {
        const pizzas = this.getPizzas();
        const nextId = pizzas.length > 0 ? Math.max(...pizzas.map(p => Number(p.id) || 0)) + 1 : 1;
        const newPizza = {
            id: nextId,
            nombre: String(pizzaData.nombre).trim(),
            descripcion: String(pizzaData.descripcion).trim(),
            precio: parseFloat(pizzaData.precio) || 0.0,
            disponible: true
        };
        pizzas.push(newPizza);
        localStorage.setItem(STORAGE_KEYS.PIZZAS, JSON.stringify(pizzas));
        return newPizza;
    },

    togglePizzaDisponibilidad(id) {
        const pizzas = this.getPizzas();
        const pizza = pizzas.find(p => p.id === Number(id));
        if (pizza) {
            pizza.disponible = !pizza.disponible;
            localStorage.setItem(STORAGE_KEYS.PIZZAS, JSON.stringify(pizzas));
        }
        return pizzas;
    },

    deletePizza(id) {
        let pizzas = this.getPizzas();
        pizzas = pizzas.filter(p => p.id !== Number(id));
        localStorage.setItem(STORAGE_KEYS.PIZZAS, JSON.stringify(pizzas));
        return pizzas;
    },

    // --- MÉTODOS DE PEDIDOS Y VALIDACIÓN DE CAPACIDAD ---
    getPedidos() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || DEFAULT_PEDIDOS;
        } catch (e) {
            return DEFAULT_PEDIDOS;
        }
    },

    // Calcula pizzas ya comprometidas por hora (no canceladas)
    getPizzasComprometidasPorHora(hora) {
        const pedidos = this.getPedidos();
        const pedidosHora = pedidos.filter(p => p.hora_recogida === hora && p.estado !== 'Cancelado');
        return pedidosHora.reduce((acc, p) => acc + (Number(p.total_pizzas) || 0), 0);
    },

    // Resumen de capacidad para todas las franjas horarias
    getResumenCapacidad() {
        return HORARIOS_DISPONIBLES.map(hora => {
            const ocupadas = this.getPizzasComprometidasPorHora(hora);
            const disponibles = Math.max(0, LIMITE_PIZZAS_POR_HORA - ocupadas);
            return {
                hora,
                limite: LIMITE_PIZZAS_POR_HORA,
                ocupadas,
                disponibles,
                estaLleno: disponibles <= 0
            };
        });
    },

    // Validación de la regla: Máximo 6 pizzas por hora
    validarCapacidadHora(hora, cantidadSolicitada) {
        const ocupadas = this.getPizzasComprometidasPorHora(hora);
        const espacioRestante = LIMITE_PIZZAS_POR_HORA - ocupadas;
        const cabe = (ocupadas + cantidadSolicitada) <= LIMITE_PIZZAS_POR_HORA;

        // Horarios alternativos donde sí caben las pizzas solicitadas
        const alternativas = cabe ? [] : HORARIOS_DISPONIBLES.filter(h => {
            if (h === hora) return false;
            const esp = LIMITE_PIZZAS_POR_HORA - this.getPizzasComprometidasPorHora(h);
            return esp >= cantidadSolicitada;
        });

        return {
            valido: cabe,
            hora,
            solicitadas: cantidadSolicitada,
            ocupadas,
            espacioRestante,
            limite: LIMITE_PIZZAS_POR_HORA,
            alternativas
        };
    },

    // Registro de un nuevo pedido
    crearPedido(datosPedido) {
        const pedidos = this.getPedidos();
        
        // Generar folio consecutivo: PED-104, etc.
        const nextNum = 100 + pedidos.length + 1;
        const folio = `PED-${nextNum}`;

        const nuevoPedido = {
            id: folio,
            cliente: String(datosPedido.cliente).trim(),
            telefono: String(datosPedido.telefono).trim(),
            pizzas: datosPedido.pizzas, // array [{ id, nombre, cantidad, precio }]
            total_pizzas: Number(datosPedido.total_pizzas),
            total_monto: parseFloat(datosPedido.total_monto),
            hora_recogida: datosPedido.hora_recogida,
            estado: "Confirmado", // Estado inicial
            fecha: new Date().toISOString().split('T')[0]
        };

        pedidos.push(nuevoPedido);
        localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
        localStorage.setItem(STORAGE_KEYS.ULTIMO_PEDIDO, folio);

        return nuevoPedido;
    },

    // Actualización de estado (Cocina / Admin)
    actualizarEstadoPedido(idPedido, nuevoEstado) {
        const pedidos = this.getPedidos();
        const pedido = pedidos.find(p => p.id === idPedido);
        if (pedido) {
            pedido.estado = nuevoEstado;
            localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
            return pedido;
        }
        return null;
    },

    // Buscar pedido por ID (folio) o por Teléfono
    buscarPedido(termino) {
        const term = String(termino).trim().toLowerCase();
        if (!term) return null;
        const pedidos = this.getPedidos();
        
        // Coincidencia exacta de folio
        let encontrado = pedidos.find(p => p.id.toLowerCase() === term);
        if (!encontrado) {
            // Coincidencia por teléfono (últimos dígitos o exacto)
            encontrado = pedidos.slice().reverse().find(p => p.telefono.replace(/\s+/g, '').includes(term));
        }
        return encontrado || null;
    },

    getUltimoPedido() {
        const folio = localStorage.getItem(STORAGE_KEYS.ULTIMO_PEDIDO);
        if (folio) {
            return this.buscarPedido(folio);
        }
        const pedidos = this.getPedidos();
        return pedidos.length > 0 ? pedidos[pedidos.length - 1] : null;
    }
};

// Autoinicializar al cargar
ItalianyStore.init();

// Exportar globalmente
window.ItalianyStore = ItalianyStore;
window.HORARIOS_DISPONIBLES = HORARIOS_DISPONIBLES;
window.LIMITE_PIZZAS_POR_HORA = LIMITE_PIZZAS_POR_HORA;
