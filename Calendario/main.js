// Colores por defecto para los equipos técnicos
const coloresPorDefecto = [
    "#007bff", // Azul
    "#28a745", // Verde
    "#fd7e14", // Naranja
    "#6f42c1"  // Morado
  ];
  
  // Datos ficticios de equipos técnicos
  const equiposTecnicos = [
    { id: 1, nombre: "Equipo Norte", integrantes: ["Carlos", "Luis", "Ana"], color: coloresPorDefecto[0] },
    { id: 2, nombre: "Equipo Sur", integrantes: ["Pedro", "María"], color: coloresPorDefecto[1] },
    { id: 3, nombre: "Equipo Este", integrantes: ["Jorge", "Sofía", "Elena"], color: coloresPorDefecto[2] },
    { id: 4, nombre: "Equipo Oeste", integrantes: ["Ricardo"], color: coloresPorDefecto[3] }
  ];
  
  // Estado de equipos activos para el filtro
  let equiposActivos = equiposTecnicos.map(eq => eq.id);
  
  // Datos ficticios de clientes
  const clientes = [
    { nombre: "Banco Central", direccion: "Av. Principal 123, San José", telefono: "2222-1111" },
    { nombre: "Hospital del Sur", direccion: "Calle 45, Cartago", telefono: "2555-2222" },
    { nombre: "Supermercado Norte", direccion: "Ruta 32, Limón", telefono: "2758-3333" },
    { nombre: "Oficinas INVAES", direccion: "Zona Franca, Heredia", telefono: "2266-4444" },
    { nombre: "Hotel Paraíso", direccion: "Playa Hermosa, Puntarenas", telefono: "2643-5555" }
  ];
  
  // Tareas posibles
  const tareasPosibles = [
    "Revisión de compresor",
    "Limpieza de filtros",
    "Chequeo eléctrico",
    "Recarga de refrigerante",
    "Cambio de piezas",
    "Ajuste de termostato",
    "Verificación de fugas",
    "Inspección general"
  ];
  
  // Asignar aleatoriamente un equipo técnico a cada tarea
  function getEquipoRandom() {
    return equiposTecnicos[Math.floor(Math.random() * equiposTecnicos.length)];
  }
  
  // Asignar aleatoriamente un cliente a cada tarea
  function getClienteRandom() {
    return clientes[Math.floor(Math.random() * clientes.length)];
  }
  
  // Generar entre 3 y 7 tareas por cada día de lunes a sábado en agosto 2025
  function generarAsignaciones() {
    const eventos = [];
    let idGlobal = 1;
    for (let dia = 1; dia <= 31; dia++) {
      const fecha = new Date(2025, 7, dia); // Mes 7 = Agosto (0-indexed)
      const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
  
      if (diaSemana === 0) continue; // Saltar domingos
  
      const numTareas = Math.floor(Math.random() * 5) + 3; // 3 a 7 tareas
      for (let i = 0; i < numTareas; i++) {
        const cliente = getClienteRandom();
        const equipo = getEquipoRandom();
        const tareasAsignadas = [];
        const numTareasAsignadas = Math.floor(Math.random() * 3) + 2; // 2 a 4 tareas por asignación
        for (let j = 0; j < numTareasAsignadas; j++) {
          tareasAsignadas.push(tareasPosibles[Math.floor(Math.random() * tareasPosibles.length)]);
        }
        eventos.push({
          id: idGlobal++,
          title: `${cliente.nombre} (${equipo.nombre})`,
          start: `2025-08-${dia.toString().padStart(2, '0')}`,
          allDay: true,
          backgroundColor: equipo.color,
          borderColor: equipo.color,
          textColor: "#fff",
          extendedProps: {
            cliente: cliente,
            equipo: equipo,
            tareas: tareasAsignadas
          }
        });
      }
    }
    return eventos;
  }
  
  // Calcular cantidad de trabajos por equipo en la semana del 4 al 9 de agosto 2025 (lunes a sábado)
  function calcularTrabajosPorEquipo(eventos) {
    const conteo = {};
    equiposTecnicos.forEach(eq => conteo[eq.nombre] = 0);
  
    const fechaInicio = new Date(2025, 7, 4); // 4 de agosto 2025
    const fechaFin = new Date(2025, 7, 9);   // 9 de agosto 2025
  
    eventos.forEach(ev => {
      const fechaEv = new Date(ev.start);
      if (fechaEv >= fechaInicio && fechaEv <= fechaFin) {
        conteo[ev.extendedProps.equipo.nombre]++;
      }
    });
    return conteo;
  }
  
  // Renderizar panel de equipos técnicos
  function renderizarPanelEquipos(conteo, onColorChange) {
    const lista = document.getElementById('lista-equipos');
    lista.innerHTML = '';
    equiposTecnicos.forEach((eq, idx) => {
      if (!equiposActivos.includes(eq.id)) return; // Solo mostrar equipos activos
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="color-preview" style="background:${eq.color}"></span>
        <span>${eq.nombre}</span>
        <input type="color" value="${eq.color}" data-equipo="${eq.id}" title="Personalizar color">
        <span class="badge">${conteo[eq.nombre]}</span>
      `;
      lista.appendChild(li);
    });
  
    // Listeners para los inputs de color
    lista.querySelectorAll('input[type="color"]').forEach(input => {
      input.addEventListener('input', function() {
        const idEquipo = parseInt(this.getAttribute('data-equipo'));
        const nuevoColor = this.value;
        const equipo = equiposTecnicos.find(eq => eq.id === idEquipo);
        if (equipo) {
          equipo.color = nuevoColor;
          // Actualizar preview
          this.parentElement.querySelector('.color-preview').style.background = nuevoColor;
          if (onColorChange) onColorChange();
        }
      });
    });
  }
  
  // Renderizar filtro de equipos
  function renderizarFiltroEquipos(onFiltroChange) {
    const filtroLista = document.getElementById('filtro-lista');
    filtroLista.innerHTML = '';
    equiposTecnicos.forEach(eq => {
      const li = document.createElement('li');
      li.innerHTML = `
        <label>
          <input type="checkbox" value="${eq.id}" ${equiposActivos.includes(eq.id) ? 'checked' : ''}>
          <span class="color-preview" style="background:${eq.color}"></span>
          ${eq.nombre}
        </label>
      `;
      filtroLista.appendChild(li);
    });
  
    filtroLista.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', function() {
        const idEquipo = parseInt(this.value);
        if (this.checked) {
          if (!equiposActivos.includes(idEquipo)) equiposActivos.push(idEquipo);
        } else {
          equiposActivos = equiposActivos.filter(id => id !== idEquipo);
        }
        if (onFiltroChange) onFiltroChange();
      });
    });
  }
  
  // Modal de boleta
  function mostrarModalBoleta(evento) {
    document.getElementById('cliente').value = evento.extendedProps.cliente.nombre;
    document.getElementById('direccion').value = evento.extendedProps.cliente.direccion;
    document.getElementById('telefono').value = evento.extendedProps.cliente.telefono;
    document.getElementById('fecha-servicio').value = evento.start.toLocaleDateString('es-CR');
    document.getElementById('equipo-tecnico').value = `${evento.extendedProps.equipo.nombre} (${evento.extendedProps.equipo.integrantes.join(", ")})`;
    const ulTareas = document.getElementById('tareas-realizadas');
    ulTareas.innerHTML = '';
    evento.extendedProps.tareas.forEach(tarea => {
      const li = document.createElement('li');
      li.textContent = tarea;
      ulTareas.appendChild(li);
    });
    document.getElementById('modal-boleta').style.display = 'block';
  }
  
  function cerrarModalBoleta() {
    document.getElementById('modal-boleta').style.display = 'none';
  }
  
  // Actualizar colores de eventos en el calendario
  function actualizarColoresEventos(calendar) {
    calendar.getEvents().forEach(ev => {
      const equipo = equiposTecnicos.find(eq => eq.id === ev.extendedProps.equipo.id);
      if (equipo) {
        ev.setProp('backgroundColor', equipo.color);
        ev.setProp('borderColor', equipo.color);
        ev.setProp('textColor', "#fff");
      }
    });
  }
  
  // Filtrar eventos por equipos activos
  function filtrarEventosPorEquipos(eventos) {
    return eventos.filter(ev => equiposActivos.includes(ev.extendedProps.equipo.id));
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    let eventosOriginales = generarAsignaciones();
  
    // Panel equipos técnicos
    let conteo = calcularTrabajosPorEquipo(filtrarEventosPorEquipos(eventosOriginales));
  
    // Inicializar calendario
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: '2025-08-01',
      locale: 'es',
      headerToolbar: {
        left: '',
        center: 'title',
        right: ''
      },
      events: filtrarEventosPorEquipos(eventosOriginales),
      editable: true, // Permite drag & drop
      droppable: false,
      eventDrop: function(info) {
        // Evitar mover tareas a domingos
        const nuevaFecha = info.event.start;
        if (nuevaFecha.getDay() === 0) {
          alert("No se pueden asignar tareas en domingo (día de descanso).");
          info.revert();
        } else {
          // Si la tarea se mueve a la semana del 4 al 9 de agosto, actualizar panel
          conteo = calcularTrabajosPorEquipo(filtrarEventosPorEquipos(calendar.getEvents()));
          renderizarPanelEquipos(conteo, () => actualizarColoresEventos(calendar));
        }
      },
      dayCellDidMount: function(arg) {
        // Deshabilitar visualmente los domingos
        if (arg.date.getDay() === 0) {
          arg.el.classList.add('fc-day-disabled');
        }
      },
      eventDidMount: function(arg) {
        // Tooltip con detalles
        arg.el.title = arg.event.title + " - " + arg.event.start.toLocaleDateString();
        // Doble click para abrir modal
        arg.el.ondblclick = function(e) {
          e.preventDefault();
          mostrarModalBoleta(arg.event);
        };
      }
    });
  
    calendar.render();
  
    // Renderizar panel y filtro
    function actualizarPanelYCalendario() {
      // Actualizar panel lateral
      conteo = calcularTrabajosPorEquipo(filtrarEventosPorEquipos(eventosOriginales));
      renderizarPanelEquipos(conteo, () => {
        actualizarColoresEventos(calendar);
        renderizarFiltroEquipos(actualizarPanelYCalendario);
      });
      // Actualizar eventos del calendario
      calendar.removeAllEvents();
      calendar.addEventSource(filtrarEventosPorEquipos(eventosOriginales));
      actualizarColoresEventos(calendar);
    }
  
    renderizarPanelEquipos(conteo, () => {
      actualizarColoresEventos(calendar);
      renderizarFiltroEquipos(actualizarPanelYCalendario);
    });
    renderizarFiltroEquipos(actualizarPanelYCalendario);
  
    // Modal
    document.getElementById('cerrar-modal').onclick = cerrarModalBoleta;
    window.onclick = function(event) {
      if (event.target == document.getElementById('modal-boleta')) {
        cerrarModalBoleta();
      }
    };
  });
  
  