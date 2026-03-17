# Guía de Pruebas Manuales - Sistema de Gestión de Tareas Pro

Esta guía detalla los pasos para validar manualmente la funcionalidad de la Web App.

| ID | Nombre del Caso | Precondiciones | Pasos | Resultado Esperado | Estado |
|:---|:---|:---|:---|:---|:---|
| **BT-01** | Carga inicial sin errores | Script desplegado | Acceder a la URL de la Web App | Se oculta el spinner y se muestra la interfaz principal | Pendiente |
| **BT-02** | Identidad del usuario | Sesión iniciada | Observar la esquina superior izquierda | Debe mostrar el correo exacto del usuario logueado | Pendiente |
| **BT-03** | Aislamiento inicial | Hoja con datos de otros usuarios | Cargar la app | Solo se listan tareas que coinciden con el email actual | Pendiente |
| **BT-04** | Estado vacío | Usuario nuevo sin tareas | Cargar la app | Se muestra el mensaje "No hay tareas. Todo listo por ahora" | Pendiente |
| **CT-01** | Crear tarea simple | App cargada | Escribir "Llamar a Juan" y presionar Enter | La tarea aparece arriba en la lista inmediatamente | Pendiente |
| **CT-02** | Crear con NLP (Prioridad) | NLP activo | Escribir "Informe p1" y presionar Enter | Tarea: "Informe", Prioridad: "Alta" (color rojo) | Pendiente |
| **CT-03** | Crear con NLP (Fecha) | NLP activo | Escribir "Reunión mañana" | Tarea: "Reunión", Fecha: Mañana (ISO) | Pendiente |
| **CT-04** | NLP Ambiguo (Último gana) | NLP activo | Escribir "Cita hoy mañana p2 p1" | Tarea: "Cita", Fecha: Mañana, Prioridad: Alta | Pendiente |
| **CT-05** | NLP Desactivado | Toggle NLP Off | Escribir "Test p1 hoy" | Se crea la tarea con el texto completo sin extraer tokens | Pendiente |
| **CT-06** | Optimistic UI (Creación) | Conexión lenta | Crear tarea | La tarea aparece con opacidad reducida antes de confirmación | Pendiente |
| **NLP-01** | Visualización de chips | Escribiendo en input | Escribir "Tarea p1 lunes" | Aparecen chips azules debajo del input para "p1" y "lunes" | Pendiente |
| **NLP-02** | Remover chip | Chip visible | Click en la "X" del chip "lunes" | El token "lunes" se elimina del input de texto | Pendiente |
| **NLP-03** | Tildes en tokens | NLP activo | Escribir "Tarea miércoles" | Se detecta el token correctamente igual que "miercoles" | Pendiente |
| **ES-01** | Completar tarea | Tarea pendiente | Click en el círculo de la tarea | La tarea se tacha y se mueve (al cambiar de filtro) | Pendiente |
| **ES-02** | Descompletar tarea | Tarea completada | Cambiar a filtro "Completadas" y click en check | La tarea vuelve a estar disponible en "Pendientes" | Pendiente |
| **ES-03** | Editar nombre | Tarea existente | Click en icono de lápiz, cambiar nombre | El nombre se actualiza en la lista y en Google Sheets | Pendiente |
| **SUB-01** | Crear subtarea | Tarea madre existe | Click en "+" de la tarea madre, escribir nombre | La tarea aparece indentada debajo de la madre | Pendiente |
| **SUB-02** | Expand/Collapse | Subtarea existe | Click en la flecha de la tarea madre | Se ocultan/muestran las subtareas correctamente | Pendiente |
| **SEC-01** | Seguridad en Update | Conocer ID ajeno | Intentar editar vía consola una tarea de otro | El backend debe rechazar la operación (OwnerEmail check) | Pendiente |
| **ERR-01** | Fallo en creación | Backend error simulado | Crear tarea | Se muestra alerta y la tarea en UI marca error de sincronización | Pendiente |
| **UX-01** | Feedback de Sincronización | Realizando cambios | Observar indicador superior | Cambia a "Sincronizando..." (amarillo) y vuelve a "Sincronizado" | Pendiente |
| **UX-02** | Layout Jerárquico | 3 niveles de profundidad | Crear subtareas de subtareas | No se rompe el diseño; los niveles profundos se colapsan | Pendiente |

---

## Instrucciones para el tester
1. Use una ventana de incógnito para asegurar que la sesión de Google es la correcta.
2. Tenga la hoja de Google Sheets abierta en otra pestaña para verificar la persistencia en tiempo real.
3. Para pruebas de error, puede renombrar temporalmente la hoja `Tareas` para forzar fallos de lectura.
