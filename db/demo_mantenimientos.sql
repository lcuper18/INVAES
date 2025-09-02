-- ... estructura de tablas ...

-- Datos de ejemplo para clientes
INSERT INTO clientes (nombre, direccion, telefono, email) VALUES
('Pedro Gómez', 'Av. Central 123', '555-1111', 'pedro.gomez@mail.com'),
('Ana Ruiz', 'Calle Falsa 456', '555-2222', 'ana.ruiz@mail.com'),
('Inmobiliaria Sol', 'Blvd. Sur 1001', '555-3333', 'contacto@inmobiliariasol.com');

-- Datos de ejemplo para empleados
INSERT INTO empleados (nombre, apellido, telefono, email, puesto) VALUES
('Carlos', 'López', '555-4444', 'carlos.lopez@empresa.com', 'Técnico'),
('Lucía', 'Martínez', '555-5555', 'lucia.martinez@empresa.com', 'Técnico'),
('Juan', 'Pérez', '555-6666', 'juan.perez@empresa.com', 'Líder de equipo'),
('Sofía', 'Ramírez', '555-7777', 'sofia.ramirez@empresa.com', 'Técnico'),
('Felipe', 'García', '555-8888', 'felipe.garcia@empresa.com', 'Líder de equipo');

-- Datos de ejemplo para inventario
INSERT INTO inventario (nombre, descripcion, cantidad, tipo) VALUES
('Filtro de Aire', 'Filtro compatible con Split 12000BTU', 12, 'repuesto'),
('Gas Refrigerante R410', 'Recarga de gas R410', 7, 'material'),
('Condensador', 'Condensador para sistemas de 18,000BTU', 3, 'repuesto'),
('Aceite Lubricante', 'Lubricante para compresores', 10, 'material'),
('Termostato Digital', 'Repuesto universal', 5, 'repuesto');

-- Datos de ejemplo para equipos de trabajo
INSERT INTO equipos_trabajo (nombre_equipo, id_lider) VALUES
('Equipo Alfa', 3),
('Equipo Beta', 5);

-- Datos de ejemplo para equipo_miembros (asignación de empleados a equipos)
-- Equipo Alfa: líder Juan (id 3), técnicos Carlos (1) y Lucía (2)
INSERT INTO equipo_miembros (id_equipo, id_empleado) VALUES
(1, 3), (1, 1), (1, 2);

-- Equipo Beta: líder Felipe (id 5), técnico Sofía (4)
INSERT INTO equipo_miembros (id_equipo, id_empleado) VALUES
(2, 5), (2, 4);

-- Datos de ejemplo para mantenimientos
INSERT INTO mantenimientos (id_cliente, id_equipo, fecha, descripcion) VALUES
(1, 1, '2024-06-10 09:30:00', 'Mantenimiento preventivo y cambio de filtro.'),
(2, 2, '2024-06-11 14:00:00', 'Revisión general. Recarga de gas y limpieza.'),
(3, 1, '2024-06-12 11:00:00', 'Cambio de condensador y revisión del sistema.');

-- Datos de ejemplo para mantenimiento_items (materiales usados en cada mantenimiento)
-- Primer mantenimiento: cambio de filtro y uso de lubricante
INSERT INTO mantenimiento_items (id_mantenimiento, id_item, cantidad_usada) VALUES
(1, 1, 1),
(1, 4, 1);

-- Segundo mantenimiento: recarga de gas y se usó lubricante
INSERT INTO mantenimiento_items (id_mantenimiento, id_item, cantidad_usada) VALUES
(2, 2, 1),
(2, 4, 1);

-- Tercer mantenimiento: cambio de condensador y revisión con termostato digital
INSERT INTO mantenimiento_items (id_mantenimiento, id_item, cantidad_usada) VALUES
(3, 3, 1),
(3, 5, 1);

-- ... resto del archivo ...