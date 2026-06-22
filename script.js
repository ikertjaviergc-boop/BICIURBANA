// Base de datos de productos
const bicicletas = [
    { id: 1, nombre: "Ruta Urbana X", tipo: "venta", precio: "$450.000", icono: "🚲" },
    { id: 2, nombre: "City Classic (Paseo)", tipo: "renta", precio: "$12.000 / día", icono: "🚲" },
    { id: 3, nombre: "E-Bike Matrix", tipo: "venta", precio: "$1.200.000", icono: "⚡" },
    { id: 4, nombre: "Mountain Track", tipo: "renta", precio: "$15.000 / día", icono: "🚵" },
    { id: 5, nombre: "Fixie Minimalist", tipo: "venta", precio: "$320.000", icono: "🚲" },
    { id: 6, nombre: "Plegable Urban Fit", tipo: "renta", precio: "$10.000 / día", icono: "🚲" }
];

// Array dinámico de tareas iniciales
let listaTareas = [
    { id: 101, texto: "Preparar despacho de Ruta Urbana X", completada: false },
    { id: 102, texto: "Mantención preventiva de la E-Bike Matrix", completada: true }
];

// Cargar bicicletas en las grillas correspondientes
function renderizarListas(listaMapeada = bicicletas) {
    const gridTodos = document.getElementById('grid-todos');
    const gridRenta = document.getElementById('grid-renta');
    const gridVenta = document.getElementById('grid-venta');

    if(!gridTodos) return;

    gridTodos.innerHTML = "";
    gridRenta.innerHTML = "";
    gridVenta.innerHTML = "";

    listaMapeada.forEach(bici => {
        const tarjetaHTML = `
            <div class="product-card">
                <div class="product-image">${bici.icono}</div>
                <div class="product-info">
                    <span class="tag tag-${bici.tipo}">${bici.tipo}</span>
                    <h3>${bici.nombre}</h3>
                    <p class="price">${bici.precio}</p>
                    <button class="btn btn-primary" style="width: 100%; padding: 8px 0; font-size: 0.9rem;">Ver Detalles</button>
                </div>
            </div>
        `;
        gridTodos.innerHTML += tarjetaHTML;
        if (bici.tipo === 'renta') gridRenta.innerHTML += tarjetaHTML;
        if (bici.tipo === 'venta') gridVenta.innerHTML += tarjetaHTML;
    });

    verificarPanelesVacios();
}

function verificarPanelesVacios() {
    ['todos', 'renta', 'venta'].forEach(id => {
        const grid = document.getElementById(`grid-${id}`);
        if(grid && grid.children.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #a0a0a0; padding: 20px;">No se encontraron resultados.</p>`;
        }
    });
}

// --- MANEJO DE PESTAÑAS (TABS) CENTRALIZADO ---
const pestañas = document.querySelectorAll('.tab-btn');
const paneles = document.querySelectorAll('.panel-contenido');

pestañas.forEach(tab => {
    tab.addEventListener('click', () => {
        pestañas.forEach(t => t.classList.remove('active'));
        paneles.forEach(p => p.classList.remove('activo'));

        tab.classList.add('active');
        const panelId = tab.dataset.panel; 
        document.getElementById(panelId).classList.add('activo');
    });
});

function activarPestanaPorServicio(servicio) {
    const pestañaDestino = document.querySelector(`.tab-btn[data-panel="${servicio}"]`);
    if(pestañaDestino) pestañaDestino.click();
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

// --- MOTOR DE BÚSQUEDA ---
function ejecutarBusqueda() {
    const termino = document.getElementById('search-input').value.toLowerCase().trim();
    const filtradas = bicicletas.filter(bici => bici.nombre.toLowerCase().includes(termino));
    renderizarListas(filtradas);
}

// --- GESTIÓN DINÁMICA DE LA VENTANA DE TAREAS (AGREGAR Y QUITAR) ---
function renderizarTareas() {
    const contenedorLista = document.getElementById('todo-list');
    if(!contenedorLista) return;
    
    contenedorLista.innerHTML = ""; 

    if(listaTareas.length === 0) {
        contenedorLista.innerHTML = `<p style="text-align: center; color: #a0a0a0; padding: 10px;">No tienes tareas pendientes. ¡Buen trabajo!</p>`;
        return;
    }

    listaTareas.forEach(tarea => {
        const itemLi = document.createElement('li');
        itemLi.classList.add('todo-item');
        if (tarea.completada) itemLi.classList.add('completada');

        itemLi.innerHTML = `
            <div class="todo-clickable">
                <span class="status-icon">${tarea.completada ? '✅' : '⭕'}</span>
                <span>${tarea.texto}</span>
            </div>
            <button class="delete-btn" title="Eliminar tarea">❌</button>
        `;

        // Acción 1: Tachar / Completar tarea (classList.toggle)
        const areaClickable = itemLi.querySelector('.todo-clickable');
        areaClickable.addEventListener('click', () => {
            itemLi.classList.toggle('completada');
            tarea.completada = !tarea.completada;
            itemLi.querySelector('.status-icon').textContent = tarea.completada ? '✅' : '⭕';
        });

        // Acción 2: Quitar / Eliminar tarea del array
        const botonEliminar = itemLi.querySelector('.delete-btn');
        botonEliminar.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se dispare el evento de completar al presionar la X
            eliminarTarea(tarea.id);
        });

        contenedorLista.appendChild(itemLi);
    });
}

function eliminarTarea(id) {
    // Filtramos para quitar el objeto que coincida con el ID recibido
    listaTareas = listaTareas.filter(t => t.id !== id);
    // Re-renderizar los cambios en el DOM
    renderizarTareas();
}

// Captura del Formulario de Tareas
document.getElementById('todo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const inputTarea = document.getElementById('todo-input');
    const textoTarea = inputTarea.value.trim();
    const errorMsg = document.getElementById('err-todo');

    if (textoTarea === "") {
        errorMsg.style.display = 'block';
        inputTarea.style.borderColor = 'var(--error-color)';
        return;
    }

    errorMsg.style.display = 'none';
    inputTarea.style.borderColor = 'var(--orange-primary)';

    // Agregar nuevo objeto al array
    listaTareas.push({
        id: Date.now(),
        texto: textoTarea,
        completada: false
    });

    inputTarea.value = "";
    renderizarTareas();
});

// --- VALIDACIONES DE LOGIN REGEX ---
document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let esValido = true;

    if (username.length < 3) {
        document.getElementById('err-username').style.display = 'block';
        esValido = false;
    } else {
        document.getElementById('err-username').style.display = 'none';
    }

    if (!emailRegex.test(email)) {
        document.getElementById('err-email').style.display = 'block';
        esValido = false;
    } else {
        document.getElementById('err-email').style.display = 'none';
    }

    if (password.length < 6) {
        document.getElementById('err-password').style.display = 'block';
        esValido = false;
    } else {
        document.getElementById('err-password').style.display = 'none';
    }

    if (esValido) {
        document.getElementById('auth-success').style.display = 'block';
        document.getElementById('auth-form').reset();
        setTimeout(() => { document.getElementById('auth-success').style.display = 'none'; }, 4000);
    }
});

document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        this.textContent = '👁️';
    }
});

// Eventos de Búsqueda
document.getElementById('search-btn').addEventListener('click', ejecutarBusqueda);
document.getElementById('search-input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') ejecutarBusqueda();
});

// Lanzamiento Inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarListas();
    renderizarTareas();
});