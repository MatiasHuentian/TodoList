# README de Validación Funcional - Sistema de Gestión de Tareas Pro

## A. Objetivo
Este documento tiene como objetivo establecer el marco de validación para la aplicación web de gestión de tareas desarrollada en Google Apps Script. Define los requisitos de entorno, la estructura de datos necesaria y los casos de uso que deben ser verificados para asegurar que la aplicación cumple con los estándares de calidad, seguridad y rendimiento exigidos.

## B. Arquitectura Resumida
La aplicación opera bajo un modelo de **Single Page Application (SPA)** integrada en el ecosistema de Google Workspace:

- **Backend (Apps Script):** Ejecuta la lógica de negocio, gestiona la autenticación nativa y realiza operaciones CRUD sobre Google Sheets.
- **Base de Datos (Google Sheets):** Almacenamiento persistente en una hoja de cálculo denominada `BD_Tareas`.
- **Frontend (HTML/JS/Tailwind):** Interfaz reactiva que utiliza un motor de NLP ligero y un patrón de **Optimistic UI** para mejorar la velocidad percibida.
- **Flujo de Comunicación:** Se utiliza `google.script.run` de forma asíncrona, minimizando las llamadas para evitar cuellos de botella y maximizar el uso de las cuotas de Google.

## C. Requisitos Previos
Para que la aplicación funcione correctamente, se deben cumplir los siguientes puntos:

1.  **Google Spreadsheet:** Debe existir un Spreadsheet accesible por el script. El script buscará (o creará) una hoja llamada `Tareas`.
2.  **Permisos de Ejecución:** La Web App debe desplegarse configurada para "Ejecutarse como: Usuario que accede" (para capturar el email correctamente) y "Quién tiene acceso: Cualquiera dentro del dominio".
3.  **Autorización Scopes:** El usuario debe autorizar los scopes `https://www.googleapis.com/auth/spreadsheets` y `https://www.googleapis.com/auth/userinfo.email`.
4.  **Cuenta Institucional:** Acceso mediante una cuenta de Google Workspace del dominio configurado.

## D. Esquema Esperado de la Hoja (`Tareas`)
La hoja de cálculo debe contener las siguientes columnas en la primera fila:

1.  **ID:** Identificador único (UUID).
2.  **OwnerEmail:** Correo electrónico del propietario de la tarea.
3.  **ID_Padre:** ID de la tarea superior (para jerarquías).
4.  **Tarea:** Título o descripción corta.
5.  **Descripcion:** Detalle extendido de la tarea.
6.  **Fecha_Ejecucion:** Fecha programada (ISO String).
7.  **Prioridad:** Alta, Media, Baja.
8.  **Estado:** Pendiente, Completada, Descartada.
9.  **Categoria:** Etiqueta de categorización.
10. **Interpretar_Comandos:** Boolean (true/false).
11. **CreatedAt:** Timestamp de creación.
12. **UpdatedAt:** Timestamp de última modificación.

## E. Casos Funcionales
La aplicación debe satisfacer los siguientes comportamientos:

-   **Bootstrap Inicial:** Carga de configuración y datos del usuario sin recarga de página.
-   **Aislamiento de Datos:** Un usuario **nunca** debe ver ni poder modificar tareas cuyo `OwnerEmail` no coincida con su sesión activa.
-   **NLP (Natural Language Processing):** Interpretación de comandos en tiempo real con visualización de chips.
-   **Optimistic UI:** La interfaz debe mostrar cambios (creación, cambio de estado) instantáneamente, sincronizando en segundo plano.
-   **Jerarquía de Subtareas:** Soporte para múltiples niveles de tareas anidadas con capacidad de colapsar/expandir nodos.
-   **Gestión de Estados:** Transiciones fluidas entre Pendiente y Completada.

## F. Criterios de Aprobación
Se considera que la app está lista para producción si:
1.  Pasa el 100% de las pruebas de aislamiento por usuario.
2.  El motor NLP elimina correctamente los tokens del texto final de la tarea.
3.  No existen errores de "Port already in use" o bloqueos de concurrencia (uso correcto de `LockService`).
4.  La UI no se bloquea durante las llamadas al backend.
5.  Las subtareas mantienen su relación jerárquica tras la recarga de la aplicación.
