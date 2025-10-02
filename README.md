# Proyecto: Sistema de Gestión INVAES (SG INVAES)

## Descripción General

**SG INVAES** es un sistema de gestión integral diseñado para administrar las operaciones de INVAES, una empresa especializada en la instalación, mantenimiento y reparación de equipos, principalmente de climatización y aire acondicionado.

El sistema está orientado a optimizar los flujos de trabajo entre los departamentos de logística, técnico y administrativo, mejorando la eficiencia en la asignación de tareas, la gestión de proyectos y el seguimiento del inventario tanto interno como el de los clientes.

La aplicación está desarrollada como una interfaz web cliente-servidor, utilizando HTML, CSS y JavaScript en el frontend, con datos de ejemplo almacenados en archivos JSON.

## Características Principales

El sistema se divide en varios módulos clave:

### 1. Gestión de Clientes
- Registro y administración de la información de clientes (personas físicas y jurídicas).
- Gestión de múltiples sedes y contactos por cliente.
- Administración de contratos de servicio, incluyendo tipo, vigencia y cobertura.

### 2. Inventario de Clientes
- Seguimiento detallado de cada equipo instalado en las sedes de los clientes.
- Historial completo de intervenciones por equipo, incluyendo:
    - Fechas y tipo de trabajo (instalación, mantenimiento, reparación).
    - Técnico asignado.
    - Número de boleta de servicio asociada.
- Registro de datos técnicos específicos del equipo (tipo de refrigerante, tecnología, etc.).

### 3. Gestión de Proyectos y Tareas
- Creación y asignación de proyectos y tareas diarias para el personal técnico.
- Capacidad para que los técnicos registren trabajos no agendados.
- Flujo de trabajo para tareas no finalizadas, que son devueltas a logística para reasignación.
- Vinculación de documentos y permisos a los proyectos.
- Indicación de la bodega donde se encuentran los materiales para un proyecto.

### 4. Logística e Inventario Interno
- Gestión del inventario de repuestos y materiales de INVAES.
- Proceso de aprobación en dos pasos para traslados de inventario entre bodegas o técnicos.
- Administración de repuestos retirados para reparación o para conseguir con muestra.

### 5. Administración
- **Gestión de Usuarios:** Mantenimiento de los perfiles y permisos del personal.
- **Sistema de Comisiones:** Cálculo de comisiones para los técnicos basado en las tareas finalizadas.
- **Boletas de Servicio:** Creación y seguimiento de las boletas generadas por cada intervención.

## Estructura del Proyecto

```
/
├── db/                           # Archivos JSON que simulan la base de datos.
│   ├── clientes.json
│   ├── inventario_cliente.json
│   ├── personal.json
│   └── ...
├── Boletas/                      # Módulo para la gestión de boletas de servicio.
├── Calendario/                   # Módulo de calendario para visualización de tareas.
├── documents/                    # Documentación del proyecto (requisitos, pitch, etc.).
├── static/                       # Recursos estáticos (CSS, imágenes).
├── administracion.html           # Vistas principales de la aplicación.
├── clientes.html
├── inventario.html
├── logistica.html
├── index.html                    # Página de inicio.
└── ...
```

## Cómo Empezar

Dado que es una aplicación web basada en archivos estáticos, para visualizar el proyecto simplemente abre el archivo `index.html` en tu navegador web preferido.

1.  Clona o descarga este repositorio.
2.  Navega a la carpeta del proyecto.
3.  Abre `index.html` en un navegador como Chrome, Firefox o Edge.

**Nota:** La interactividad que requiere manipulación de datos (guardar, editar, eliminar) no será persistente, ya que el proyecto utiliza archivos JSON como una base de datos simulada y no cuenta con un backend completamente funcional para procesar estas solicitudes.