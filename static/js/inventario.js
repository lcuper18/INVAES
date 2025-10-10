document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let bodegas = [], personal = [], articulos = [], movimientos = [];
    let currentUser = null;

    // --- DOM ELEMENTS ---
    const userSelect = document.getElementById('user-select');
    const movementTypeSelect = document.getElementById('movement-type');
    const sourceLocationSelect = document.getElementById('source-location');
    const destinationLocationSelect = document.getElementById('destination-location');
    const movementItemSelect = document.getElementById('movement-item');
    const itemDetailsSection = document.getElementById('item-details');
    const reportOutput = document.getElementById('report-output');
    const encargadoSelect = document.getElementById('encargado-select');
    const pendingTransfersList = document.getElementById('pending-transfers-list');
    const views = {
        inventory: document.getElementById('inventory-view'),
        warehouses: document.getElementById('warehouses-view'),
        reports: document.getElementById('reports-view'),
        pendingTransfers: document.getElementById('pending-transfers-view')
    };

    const TIPO_MOVIMIENTO_ES = { entry: 'Entrada', exit: 'Salida', transfer: 'Traslado' };

    // --- INITIALIZATION ---
    async function fetchData() {
        try {
            const [bodegasRes, pRes, artRes, movRes] = await Promise.all([
                fetch('db/bodegas.json'), fetch('db/personal.json'),
                fetch('db/articulos.json'), fetch('db/movimientos_inventario.json')
            ]);
            bodegas = await bodegasRes.json();
            personal = await pRes.json();
            articulos = await artRes.json();
            movimientos = await movRes.json();
            initialize();
        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("No se pudieron cargar los datos.");
        }
    }

    function initialize() {
        renderUserSelection();
        const firstActiveUser = personal.find(p => p.estado === 'activo');
        if (firstActiveUser) {
            setCurrentUser(firstActiveUser.id_personal);
        }
        showView('inventory');
    }

    function refreshUI() {
        renderMasterInventory();
        updateMovementFormOptions();
        renderGlobalHistory();
        renderEncargadoOptions();
        renderWarehouses();
        renderPendingTransfers();
    }

    // --- RENDER & HELPER FUNCTIONS ---
    const getArticulo = (id) => articulos.find(a => a.id === id) || {};
    const getBodega = (id) => bodegas.find(b => b.id === id) || {};
    const getPersonal = (id) => personal.find(p => p.id_personal === id) || { nombre_completo: 'N/A', nombre: 'N/A' };
    const formatCurrency = (val) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(val);

    function renderUserSelection() {
        userSelect.innerHTML = personal
            .filter(p => p.estado === 'activo')
            .map(p => `<option value="${p.id_personal}">${p.nombre_completo}</option>`).join('');
    }

    function setCurrentUser(userId) {
        currentUser = getPersonal(userId);
        userSelect.value = userId;
        console.log(`Usuario actual: ${currentUser.nombre_completo}`);
        refreshUI();
    }

    function renderPendingTransfers() {
        if (!currentUser) return;
        const myManagedBodegas = bodegas.filter(b => b.id_encargado_actual === currentUser.id_personal).map(b => b.id);
        const pending = movimientos.filter(m => m.tipo === 'transfer' && m.estado === 'pendiente' && myManagedBodegas.includes(m.id_bodega_destino));
        
        pendingTransfersList.innerHTML = pending.length === 0 ? '<tr><td colspan="7">No tiene traslados pendientes de aceptar.</td></tr>' : '';
        pending.forEach(m => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${m.id}</td>
                <td>${getArticulo(m.id_articulo).nombre}</td>
                <td>${m.cantidad}</td>
                <td>${getBodega(m.id_bodega_origen).nombre}</td>
                <td>${getPersonal(m.id_usuario_creacion).nombre_completo}</td>
                <td>${new Date(m.fecha).toLocaleString()}</td>
                <td><button class="action-btn" onclick="acceptTransfer('${m.id}')">Aceptar</button></td>
            `;
            pendingTransfersList.appendChild(row);
        });
    }

    function renderMasterInventory() {
        const tbody = document.getElementById('master-inventory-list');
        tbody.innerHTML = articulos.map(item => {
            const total = item.stock.reduce((sum, s) => sum + s.cantidad, 0);
            return `<tr onclick="selectItem('${item.id}')"><td>${item.id}</td><td>${item.nombre}</td><td>${total}</td></tr>`;
        }).join('');
    }

    function selectItem(itemId) {
        const item = getArticulo(itemId);
        if (!item.id) return;
        document.getElementById('selected-item-name').innerText = item.nombre;
        
        const locationsBody = document.getElementById('item-locations-table').querySelector('tbody');
        locationsBody.innerHTML = bodegas.map(bodega => {
            const stockInfo = item.stock.find(s => s.id_bodega === bodega.id);
            return `<tr><td>${bodega.nombre}</td><td>${stockInfo ? stockInfo.cantidad : 0}</td></tr>`;
        }).join('');

        const historyList = document.getElementById('item-history-list');
        const filteredHistory = movimientos.filter(m => m.id_articulo === itemId).slice().reverse();
        historyList.innerHTML = filteredHistory.length > 0 ? filteredHistory.map(m => `<li>
            <strong>${TIPO_MOVIMIENTO_ES[m.tipo].toUpperCase()}</strong> de ${m.cantidad} uds. (por ${getPersonal(m.id_usuario_creacion).nombre})
            <br><small>Ref: ${m.documento_referencia} | Fecha: ${new Date(m.fecha).toLocaleString()}</small>
        </li>`).join('') : '<li>No hay movimientos.</li>';

        itemDetailsSection.style.display = 'block';
    }

    function renderGlobalHistory() {
        const list = document.getElementById('global-history-list');
        list.innerHTML = movimientos.slice().reverse().map(m => {
            let details = ``;
            if (m.tipo === 'entry') details = `a <strong>${getBodega(m.id_bodega_destino).nombre}</strong>`;
            else if (m.tipo === 'exit') details = `de <strong>${getBodega(m.id_bodega_origen).nombre}</strong>`;
            else if (m.tipo === 'transfer') details = `de <strong>${getBodega(m.id_bodega_origen).nombre}</strong> a <strong>${getBodega(m.id_bodega_destino).nombre}</strong>`;
            
            let acceptance = m.id_usuario_aceptacion ? `| Aceptado por: ${getPersonal(m.id_usuario_aceptacion).nombre}` : '';
            if (m.tipo === 'transfer' && m.estado === 'pendiente') acceptance = '| <strong>PENDIENTE DE ACEPTACIÓN</strong>';

            return `<li style="padding: 5px 0; border-bottom: 1px solid #eee;">${new Date(m.fecha).toLocaleString()}: 
                <strong>${TIPO_MOVIMIENTO_ES[m.tipo]}</strong> de ${m.cantidad}x "${getArticulo(m.id_articulo).nombre}" ${details}.
                <br><small>Registrado por: ${getPersonal(m.id_usuario_creacion).nombre} ${acceptance}</small>
            </li>`;
        }).join('');
    }

    function renderWarehouses() {
        document.getElementById('warehouses-list').innerHTML = bodegas.map(b => `
            <tr><td>${b.id}</td><td>${b.nombre}</td><td>${b.tipo}</td><td>${b.placa || 'N/A'}</td><td>${getPersonal(b.id_encargado_actual).nombre_completo}</td></tr>
        `).join('');
    }

    function renderEncargadoOptions() {
        encargadoSelect.innerHTML = personal.filter(p => p.estado === 'activo').map(p => `<option value="${p.id_personal}">${p.nombre_completo}</option>`).join('');
    }

    // --- ACTIONS & EVENT HANDLERS ---
    function updateMovementFormOptions() {
        const type = movementTypeSelect.value;
        [sourceLocationSelect, destinationLocationSelect, movementItemSelect].forEach(s => s.innerHTML = '');
        
        const addBodegaOpts = (sel) => sel.innerHTML = bodegas.map(b => `<option value="${b.id}">${b.nombre}</option>`).join('');

        document.querySelector('label[for="source-location"]').style.display = (type === 'exit' || type === 'transfer') ? 'block' : 'none';
        sourceLocationSelect.style.display = (type === 'exit' || type === 'transfer') ? 'block' : 'none';
        document.querySelector('label[for="destination-location"]').style.display = (type === 'entry' || type === 'transfer') ? 'block' : 'none';
        destinationLocationSelect.style.display = (type === 'entry' || type === 'transfer') ? 'block' : 'none';

        if (type === 'entry') {
            addBodegaOpts(destinationLocationSelect);
            movementItemSelect.innerHTML = articulos.map(i => `<option value="${i.id}">${i.nombre}</option>`).join('');
        } else {
            addBodegaOpts(sourceLocationSelect);
            if (type === 'transfer') addBodegaOpts(destinationLocationSelect);
            updateItemsForLocation(sourceLocationSelect.value);
        }
    }

    function updateItemsForLocation(bodegaId) {
        movementItemSelect.innerHTML = articulos.map(articulo => {
            const stock = articulo.stock.find(s => s.id_bodega === bodegaId);
            return stock && stock.cantidad > 0 ? `<option value="${articulo.id}">${articulo.nombre} (${stock.cantidad} disp.)</option>` : '';
        }).join('');
    }

    window.registerMovement = () => {
        const tipo = movementTypeSelect.value;
        const id_articulo = movementItemSelect.value;
        const cantidad = parseInt(document.getElementById('movement-quantity').value);
        const id_bodega_origen = sourceLocationSelect.value;
        const id_bodega_destino = destinationLocationSelect.value;

        if (!id_articulo || !currentUser || isNaN(cantidad) || cantidad <= 0) {
            return alert('Faltan datos o la cantidad es inválida.');
        }

        const nuevoMovimiento = {
            id: `MOV-${Date.now()}`,
            id_articulo, cantidad, tipo,
            fecha: new Date().toISOString(),
            id_bodega_origen: tipo !== 'entry' ? id_bodega_origen : null,
            id_bodega_destino: tipo !== 'exit' ? id_bodega_destino : null,
            documento_referencia: `REF-${Date.now()}`,
            id_usuario_creacion: currentUser.id_personal,
            id_usuario_aceptacion: null,
            estado: (tipo === 'transfer') ? 'pendiente' : 'completado'
        };

        const articulo = getArticulo(id_articulo);
        const stockOrigen = articulo.stock.find(s => s.id_bodega === id_bodega_origen);

        if (tipo === 'exit' || tipo === 'transfer') {
            if (!stockOrigen || stockOrigen.cantidad < cantidad) return alert('Stock insuficiente en origen.');
            stockOrigen.cantidad -= cantidad;
        }
        if (tipo === 'entry') {
            const stockDestino = articulo.stock.find(s => s.id_bodega === id_bodega_destino);
            if (stockDestino) stockDestino.cantidad += cantidad; else articulo.stock.push({ id_bodega: id_bodega_destino, cantidad });
        }

        movimientos.push(nuevoMovimiento);
        alert(`Movimiento de ${TIPO_MOVIMIENTO_ES[tipo]} registrado. ${(tipo === 'transfer') ? 'Pendiente de aceptación.' : ''}`);
        console.log("Simulación de guardado: Nuevo movimiento", nuevoMovimiento);
        refreshUI();
    };

    window.acceptTransfer = (movementId) => {
        const movimiento = movimientos.find(m => m.id === movementId);
        if (!movimiento || !currentUser) return;

        movimiento.estado = 'completado';
        movimiento.id_usuario_aceptacion = currentUser.id_personal;

        const articulo = getArticulo(movimiento.id_articulo);
        const stockDestino = articulo.stock.find(s => s.id_bodega === movimiento.id_bodega_destino);
        if (stockDestino) stockDestino.cantidad += movimiento.cantidad; else articulo.stock.push({ id_bodega: movimiento.id_bodega_destino, cantidad: movimiento.cantidad });

        alert(`Traslado ${movementId} aceptado.`);
        console.log("Simulación de guardado: Movimiento actualizado", movimiento);
        refreshUI();
    };

    window.createNewWarehouse = () => {
        const nombre = document.getElementById('warehouse-name').value;
        const tipo = document.getElementById('warehouse-type').value;
        const placa = document.getElementById('placa').value;
        const id_encargado = encargadoSelect.value;
        if (!nombre || !id_encargado) return alert('Por favor, complete el nombre y el encargado.');

        const nuevaBodega = {
            id: `BODEGA-${Date.now()}`,
            nombre, tipo,
            placa: tipo === 'movil' ? placa : null,
            id_encargado_actual: id_encargado
        };
        bodegas.push(nuevaBodega);
        alert('Bodega creada con éxito (simulado).');
        document.getElementById('new-warehouse-form').style.display = 'none';
        refreshUI();
    };
    window.toggleNewWarehouseForm = () => document.getElementById('new-warehouse-form').style.display = document.getElementById('new-warehouse-form').style.display === 'none' ? 'block' : 'none';

    window.showReport = (reportType) => {
        let content = '';
        switch(reportType) {
            case 'stock':
                content = `<div class="section-header">Informe de Stock Actual por Bodega</div><table><thead><tr><th>Artículo</th>${bodegas.map(b => `<th>${b.nombre}</th>`).join('')}</tr></thead><tbody>${articulos.map(item => `<tr><td>${item.nombre}</td>${bodegas.map(bodega => {const stockInfo = item.stock.find(s => s.id_bodega === bodega.id); return `<td>${stockInfo ? stockInfo.cantidad : 0}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
                break;
            case 'movements':
                content = `<div class="section-header">Historial de Movimientos Global</div><ul style="list-style: none; padding: 0; margin-top: 10px;">${movimientos.length > 0 ? movimientos.slice().reverse().map(m => {let locInfo = ''; if (m.tipo === 'entry') locInfo = `A: ${getBodega(m.id_bodega_destino).nombre}`; else if (m.tipo === 'exit') locInfo = `De: ${getBodega(m.id_bodega_origen).nombre}`; else if (m.tipo === 'transfer') locInfo = `De: ${getBodega(m.id_bodega_origen).nombre} a ${getBodega(m.id_bodega_destino).nombre}`; let acceptance = m.id_usuario_aceptacion ? `| Aceptado por: ${getPersonal(m.id_usuario_aceptacion).nombre}` : ''; if (m.tipo === 'transfer' && m.estado === 'pendiente') acceptance = '| PENDIENTE DE ACEPTACIÓN'; return `<li style="border-bottom: 1px solid #eee; padding: 8px 0;"><strong>${new Date(m.fecha).toLocaleString()}:</strong> ${TIPO_MOVIMIENTO_ES[m.tipo]} de ${m.cantidad} x "${getArticulo(m.id_articulo).nombre}". ${locInfo}<br><small>Registrado por: ${getPersonal(m.id_usuario_creacion).nombre} ${acceptance}</small></li>`;}).join('') : '<li>No hay movimientos registrados.</li>'}</ul>`;
                break;
            case 'consumption':
                const consumptionByTech = {};
                movimientos.filter(m => m.tipo === 'exit').forEach(m => {const techId = m.id_usuario_creacion; if (!consumptionByTech[techId]) {consumptionByTech[techId] = [];} consumptionByTech[techId].push(m);});
                content = `<div class="section-header">Consumo por Técnico</div>`;
                if (Object.keys(consumptionByTech).length > 0) {for (const techId in consumptionByTech) {content += `<h4>${getPersonal(techId).nombre_completo}</h4><ul>`; consumptionByTech[techId].forEach(m => {content += `<li>${new Date(m.fecha).toLocaleDateString()}: ${m.cantidad} x ${getArticulo(m.id_articulo).nombre}</li>`;}); content += `</ul>`;}} else {content += '<p>No hay registros de consumo.</p>';}
                break;
            case 'reorder':
                content = `<div class="section-header">Artículos en Punto de Reorden</div><table><thead><tr><th>Artículo</th><th>Stock Actual</th><th>Punto de Reorden</th><th>Sugerencia</th></tr></thead><tbody>`;
                let itemsToReorder = 0;
                articulos.forEach(item => {const totalStock = item.stock.reduce((sum, s) => sum + s.cantidad, 0); if (totalStock <= item.punto_reorden) {itemsToReorder++; content += `<tr><td>${item.nombre}</td><td>${totalStock}</td><td>${item.punto_reorden}</td><td>Comprar ${item.punto_reorden * 2 - totalStock} unidades</td></tr>`;}});
                content += `</tbody></table>`;
                if (itemsToReorder === 0) content = '<div class="section-header">Artículos en Punto de Reorden</div><p>No hay artículos que necesiten ser reabastecidos.</p>';
                break;
            case 'value':
                let grandTotal = 0;
                content = `<div class="section-header">Valor del Inventario</div><table><thead><tr><th>Artículo</th><th>Stock Total</th><th>Costo Unitario</th><th>Valor Total</th></tr></thead><tbody>`;
                articulos.forEach(item => {const totalStock = item.stock.reduce((sum, s) => sum + s.cantidad, 0); const itemValue = totalStock * item.costo; grandTotal += itemValue; content += `<tr><td>${item.nombre}</td><td>${totalStock}</td><td>${formatCurrency(item.costo)}</td><td>${formatCurrency(itemValue)}</td></tr>`;});
                content += `</tbody><tfoot><tr><td colspan="3" style="text-align:right; font-weight:bold;">Valor Total:</td><td style="font-weight:bold;">${formatCurrency(grandTotal)}</td></tr></tfoot></table>`;
                break;
            case 'low-rotation':
                const ninetyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 90));
                content = `<div class="section-header">Artículos de Baja Rotación (sin mov. en 90 días)</div><table><thead><tr><th>Artículo</th><th>Último Movimiento</th></tr></thead><tbody>`;
                let lowRotationItems = 0;
                articulos.forEach(item => {const lastMovement = movimientos.filter(m => m.id_articulo === item.id).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]; if (!lastMovement || new Date(lastMovement.fecha) < ninetyDaysAgo) {lowRotationItems++; content += `<tr><td>${item.nombre}</td><td>${lastMovement ? new Date(lastMovement.fecha).toLocaleDateString() : 'Nunca'}</td></tr>`;}});
                content += `</tbody></table>`;
                if (lowRotationItems === 0) content = '<div class="section-header">Artículos de Baja Rotación</div><p>Todos los artículos tienen movimiento reciente.</p>';
                break;
        }
        reportOutput.innerHTML = content;
    }

    // --- VIEW MANAGEMENT ---
    window.showView = (view) => {
        Object.values(views).forEach(v => v.style.display = 'none');
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        views[view].style.display = 'flex';
        document.querySelector(`[onclick="showView('${view}')"]`).classList.add('active');
        if (view === 'reports') showReport('stock');
        if (view === 'pendingTransfers') renderPendingTransfers();
    };

    // --- EVENT LISTENERS ---
    userSelect.addEventListener('change', (e) => setCurrentUser(e.target.value));
    movementTypeSelect.addEventListener('change', updateMovementFormOptions);
    sourceLocationSelect.addEventListener('change', (e) => {
        if (movementTypeSelect.value !== 'entry') updateItemsForLocation(e.target.value);
    });

    fetchData();
});