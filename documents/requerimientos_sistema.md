# Requerimientos importantes:

## Gestión de Tareas y Proyectos
*   **Subtareas para proyectos:** Las tareas ligadas a proyectos (como mandados de recolección de materiales) deben poder crearse como subtareas.
*   **Proyectos opcionales:** Incluir en la asignación diaria proyectos opcionales por si el personal termina las labores principales.
*   **Tareas pendientes:** Las tareas no finalizadas del día deben trasladarse automáticamente al departamento de logística para su reasignación.
*   **Trabajos no agendados:** El personal técnico debe poder crear sus propios proyectos para registrar trabajos adicionales que se realicen en el momento y no estén agendados.

## Información de Proyectos
*   **Ubicación de materiales:** En la ficha del proyecto, debe haber un espacio para indicar en qué bodega se encuentran los materiales necesarios.
*   **Permisos:** El sistema debe almacenar las fechas de los permisos aprobados asociados a cada proyecto.
*   **Documentación:** El sistema debe permitir adjuntar documentos a los proyectos.

## Flujo de Proyectos
*   **Cierre de proyectos:** Los proyectos terminados se deben trasladar automáticamente al departamento encargado para el proceso administrativo.

## Comisiones e Inventario
*   **Rubro de comisión:** Implementar un rubro de comisión por proyecto, que pueda ser calculado y extraído por semana desde el sistema.
*   **Gestión de repuestos:** El sistema debe gestionar el retiro de repuestos para reparar o conseguir con muestra.

## Inventario del Cliente
*   **Historial de equipos:** Cada equipo debe mostrar un historial que incluya:
    *   Fechas de las intervenciones.
    *   Técnico que realizó el trabajo.
    *   Número de boleta.
    *   Tipo de trabajo realizado.
*   **Datos contractuales:** Registrar el número de contrato por cliente.
*   **Datos técnicos del equipo:** Incluir campos para:
    *   Tipo de refrigerante.
    *   Tecnología.
*   **Cambios en los datos:**
    *   **Eliminar:** Se debe quitar el dato de "fecha de instalación".
    *   **Renombrar:** Cambiar el nombre del campo "último mant." (mantenimiento) por "última intervención".

## Información de Contacto del Cliente
*   **Detalles de contacto:** En la información de contacto del cliente, se debe agregar un campo para "Departamento/Oficina".

## Sistema de Comisiones (Detallado)
*   **Asignación de tareas:** El monto de la comisión por tarea es fijo.
*   **Definición del monto:** El monto lo fija el encargado de logística.
*   **Método de pago:** El pago de la comisión se realiza según el porcentaje de finalización de las tareas asignadas.

## Inventario General de INVAES
*   **Gestión de traslados:** Cuando se realizan traslados de inventario, el sistema debe gestionar un proceso de dos pasos:
    *   Creación del movimiento de traslado.
    *   Aceptación/confirmación del mismo por parte del receptor.