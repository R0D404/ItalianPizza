/* ============================================================
   Italiany Pizzas · Módulo de autenticación (demo frontend)
   - Independiente de data-store.js (no lo modifica)
   - Sesión en sessionStorage (se cierra al cerrar la pestaña)
   - Usuarios extra registrados en localStorage
   - Todo envuelto en try/catch: si el storage falla, no rompe la app
   ============================================================ */
(function (global) {
    'use strict';

    var SESSION_KEY = 'italiany_session';
    var USERS_KEY = 'italiany_users';

    // Hash simple (demo). En un backend real se usa bcrypt/argon2.
    function hash(texto) {
        var h = 5381, s = 'italiany|' + String(texto);
        for (var i = 0; i < s.length; i++) {
            h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
        }
        return h.toString(16);
    }

    // Cuentas de demostración
    var DEMO_USERS = [
        { usuario: 'admin',   nombre: 'Administrador',  rol: 'admin',   pass: hash('admin123')   },
        { usuario: 'cocina',  nombre: 'Chef de Cocina', rol: 'cocina',  pass: hash('cocina123')  },
        { usuario: 'cliente', nombre: 'Cliente Demo',   rol: 'cliente', pass: hash('cliente123') }
    ];

    var HOME_POR_ROL = {
        admin:   'vistas/admin/index.html',
        cocina:  'vistas/cocina/index.html',
        cliente: 'vistas/cliente/index.html'
    };

    function leer(storage, key) {
        try { return JSON.parse(storage.getItem(key)); } catch (e) { return null; }
    }
    function escribir(storage, key, valor) {
        try { storage.setItem(key, JSON.stringify(valor)); return true; } catch (e) { return false; }
    }

    function usuariosRegistrados() {
        var extra = leer(global.localStorage, USERS_KEY);
        return DEMO_USERS.concat(Array.isArray(extra) ? extra : []);
    }

    // Ruta base del proyecto (funciona desde raíz o desde vistas/xxx/)
    function base() {
        var p = global.location.pathname;
        var i = p.lastIndexOf('/vistas/');
        if (i !== -1) return '../../';
        return '';
    }

    var Auth = {
        homePorRol: function (rol) { return base() + (HOME_POR_ROL[rol] || 'index.html'); },

        login: function (usuario, password) {
            usuario = String(usuario || '').trim().toLowerCase();
            password = String(password || '');
            if (!usuario || !password) {
                return { ok: false, error: 'Escribe tu usuario y contraseña.' };
            }
            var lista = usuariosRegistrados();
            var encontrado = null;
            for (var i = 0; i < lista.length; i++) {
                if (lista[i].usuario === usuario) { encontrado = lista[i]; break; }
            }
            if (!encontrado || encontrado.pass !== hash(password)) {
                return { ok: false, error: 'Usuario o contraseña incorrectos.' };
            }
            var sesion = {
                usuario: encontrado.usuario,
                nombre: encontrado.nombre,
                rol: encontrado.rol,
                inicio: Date.now()
            };
            if (!escribir(global.sessionStorage, SESSION_KEY, sesion)) {
                return { ok: false, error: 'No se pudo guardar la sesión. Revisa que tu navegador permita almacenamiento.' };
            }
            return { ok: true, sesion: sesion };
        },

        registrar: function (nombre, usuario, password) {
            nombre = String(nombre || '').trim();
            usuario = String(usuario || '').trim().toLowerCase();
            password = String(password || '');
            if (nombre.length < 3) return { ok: false, error: 'El nombre debe tener al menos 3 caracteres.' };
            if (!/^[a-z0-9_.]{3,20}$/.test(usuario)) {
                return { ok: false, error: 'Usuario: 3 a 20 caracteres (letras, números, punto o guion bajo).' };
            }
            if (password.length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
            var lista = usuariosRegistrados();
            for (var i = 0; i < lista.length; i++) {
                if (lista[i].usuario === usuario) return { ok: false, error: 'Ese usuario ya existe.' };
            }
            var extra = leer(global.localStorage, USERS_KEY);
            extra = Array.isArray(extra) ? extra : [];
            extra.push({ usuario: usuario, nombre: nombre, rol: 'cliente', pass: hash(password) });
            if (!escribir(global.localStorage, USERS_KEY, extra)) {
                return { ok: false, error: 'No se pudo guardar la cuenta en este navegador.' };
            }
            return Auth.login(usuario, password);
        },

        sesion: function () {
            var s = leer(global.sessionStorage, SESSION_KEY);
            return s && s.usuario && s.rol ? s : null;
        },

        logout: function () {
            try { global.sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* nada */ }
            global.location.href = base() + 'login.html';
        },

        /* Protege una página. Uso: Auth.requireRole(['admin']);
           Sin argumentos exige solo sesión iniciada. */
        requireRole: function (roles) {
            var s = Auth.sesion();
            if (!s) {
                global.location.replace(base() + 'login.html?next=' + encodeURIComponent(global.location.pathname.split('/').slice(-3).join('/')));
                return null;
            }
            if (roles && roles.length && roles.indexOf(s.rol) === -1) {
                global.location.replace(base() + 'login.html?denegado=1');
                return null;
            }
            return s;
        },

        /* Rellena una barra con usuario y botón de salir.
           HTML esperado: <span id="auth-user"></span> y <button id="auth-logout"> */
        montarBarra: function () {
            var s = Auth.sesion();
            var u = global.document.getElementById('auth-user');
            var b = global.document.getElementById('auth-logout');
            if (u && s) u.textContent = s.nombre + ' (' + s.rol + ')';
            if (b) b.addEventListener('click', Auth.logout);
        }
    };

    global.Auth = Auth;
})(window);
