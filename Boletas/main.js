// Datos ficticios de clientes
const clientes = [
    { id: 1, nombre: "Banco Central" },
    { id: 2, nombre: "Hospital del Sur" },
    { id: 3, nombre: "Supermercado Norte" },
    { id: 4, nombre: "Oficinas INVAES" },
    { id: 5, nombre: "Hotel Paraíso" }
  ];
  
  // Tickets en memoria (para demo)
  let tickets = JSON.parse(localStorage.getItem('ticketsDemo')) || [
    {
      id: 1,
      clienteId: 1,
      tipo: "Mantenimiento",
      fecha: "2025-08-05",
      subtareas: ["Limpieza de filtros", "Chequeo eléctrico"]
    },
    {
      id: 2,
      clienteId: 3,
      tipo: "Reparación",
      fecha: "2025-08-07",
      subtareas: ["Cambio de piezas", "Verificación de fugas"]
    }
  ];
  
  // Guardar tickets en localStorage (para persistencia en demo)
  function guardarTickets() {
    localStorage.setItem('ticketsDemo', JSON.stringify(tickets));
  }
  
  // Dashboard
  function inicializarDashboard() {
    // Llenar filtro de clientes
    const filtroCliente = document.getElementById('filtro-cliente');
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nombre;
      filtroCliente.appendChild(opt);
    });
  
    // Filtros
    filtroCliente.onchange = filtrarYMostrarTickets;
    document.getElementById('filtro-tipo').onchange = filtrarYMostrarTickets;
  
    filtrarYMostrarTickets();
  }
  
  // Mostrar tickets en tabla
  function filtrarYMostrarTickets() {
    const filtroCliente = document.getElementById('filtro-cliente').value;
    const filtroTipo = document.getElementById('filtro-tipo').value;
    const tbody = document.querySelector('#tabla-tickets tbody');
    tbody.innerHTML = '';
  
    let filtrados = tickets;
    if (filtroCliente) filtrados = filtrados.filter(t => t.clienteId == filtroCliente);
    if (filtroTipo) filtrados = filtrados.filter(t => t.tipo == filtroTipo);
  
    if (filtrados.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" style="text-align:center;">Sin tickets</td>`;
      tbody.appendChild(tr);
      return;
    }
  
    filtrados.forEach(t => {
      const cliente = clientes.find(c => c.id === t.clienteId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.id}</td>
        <td>${cliente ? cliente.nombre : ''}</td>
        <td>${t.tipo}</td>
        <td>${t.fecha}</td>
        <td>${t.subtareas.map(s => `<li>${s}</li>`).join('')}</td>
        <td>
          <button onclick="editarTicket(${t.id})">Editar</button>
          <button onclick="eliminarTicket(${t.id})" style="background:#dc3545;">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  // Ir a editar ticket
  function editarTicket(id) {
    localStorage.setItem('ticketEditId', id);
    window.location = 'ticket_crud.html';
  }
  
  // Eliminar ticket
  function eliminarTicket(id) {
    if (confirm('¿Eliminar este ticket?')) {
      tickets = tickets.filter(t => t.id !== id);
      guardarTickets();
      filtrarYMostrarTickets();
    }
  }
  
  // CRUD
  function inicializarCRUD() {
    // Llenar combobox de clientes
    const selectCliente = document.getElementById('cliente');
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nombre;
      selectCliente.appendChild(opt);
    });
  
    // Si es edición, cargar datos
    let ticketEditId = localStorage.getItem('ticketEditId');
    let ticketEdit = null;
    if (ticketEditId) {
      ticketEdit = tickets.find(t => t.id == ticketEditId);
      if (ticketEdit) {
        document.getElementById('titulo-formulario').textContent = "Editar Ticket";
        selectCliente.value = ticketEdit.clienteId;
        document.getElementById('tipo-trabajo').value = ticketEdit.tipo;
        document.getElementById('fecha').value = ticketEdit.fecha;
        ticketEdit.subtareas.forEach(st => agregarSubtarea(st));
      }
      localStorage.removeItem('ticketEditId');
    }
  
    // Subtareas
    window.agregarSubtarea = function(valor) {
      const input = document.getElementById('nueva-subtarea');
      const lista = document.getElementById('subtareas-lista');
      let texto = valor || input.value.trim();
      if (!texto) return;
      const div = document.createElement('div');
      div.className = 'subtarea-item';
      div.innerHTML = `
        <span>${texto}</span>
        <button type="button" onclick="this.parentElement.remove()" style="background:#dc3545;">Quitar</button>
      `;
      lista.appendChild(div);
      if (!valor) input.value = '';
    };
  
    // Guardar ticket
    document.getElementById('form-ticket').onsubmit = function(e) {
      e.preventDefault();
      const clienteId = parseInt(selectCliente.value);
      const tipo = document.getElementById('tipo-trabajo').value;
      const fecha = document.getElementById('fecha').value;
      const subtareas = Array.from(document.querySelectorAll('#subtareas-lista .subtarea-item span')).map(s => s.textContent);
  
      if (!clienteId || !tipo || !fecha || subtareas.length === 0) {
        alert('Complete todos los campos y agregue al menos una subtarea.');
        return;
      }
  
      if (ticketEdit) {
        // Editar
        ticketEdit.clienteId = clienteId;
        ticketEdit.tipo = tipo;
        ticketEdit.fecha = fecha;
        ticketEdit.subtareas = subtareas;
      } else {
        // Nuevo
        const nuevo = {
          id: tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
          clienteId, tipo, fecha, subtareas
        };
        tickets.push(nuevo);
      }
      guardarTickets();
      window.location = 'index.html';
    };
  }
  
  