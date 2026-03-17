# 📋 Gestión de Tareas Pro

Una aplicación web moderna de gestión de tareas integrada con Google Workspace, diseñada para aumentar la productividad mediante un procesamiento natural del lenguaje (NLP) ligero y una interfaz intuitiva.

## 🎯 Descripción General

**Gestión de Tareas Pro** es una Single Page Application (SPA) que permite a los usuarios crear, organizar y gestionar tareas de forma eficiente. La aplicación se ejecuta como Google Apps Script desplegado como Web App, utilizando Google Sheets como base de datos persistente.

### Características principales:

- ✨ **Interfaz moderna y reactiva** - Diseño limpio con Tailwind CSS
- 🤖 **Motor NLP integrado** - Detecta prioridades (p1, p2, p3) y fechas (hoy, mañana, días de la semana) automáticamente
- 📊 **Tareas jerárquicas** - Soporte para subtareas anidadas con expansión/colapso
- 🚀 **Optimistic UI** - Los cambios se reflejan instantáneamente en la interfaz
- 🔒 **Aislamiento de datos** - Cada usuario solo ve y modifica sus propias tareas
- 💬 **Retroalimentación en tiempo real** - Indicadores visuales de sincronización
- 🎨 **Prioridades con código de color** - Visualización rápida del nivel de urgencia

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│           Frontend (Index.html)                         │
│  - Vue-like Reactive UI                               │
│  - NLP Parser                                          │
│  - Gestión de Estado Local                            │
└─────────────┬───────────────────────────────────────────┘
              │ google.script.run (async)
              ▼
┌─────────────────────────────────────────────────────────┐
│      Backend (Code.gs - Google Apps Script)            │
│  - Autenticación nativa de Google                      │
│  - CRUD Operations                                     │
│  - Control de acceso por email                         │
│  - Lock Service (concurrencia)                         │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│    Base de Datos (Google Sheets - BD_Tareas)          │
│  - Hoja: "Tareas"                                      │
│  - Columnas: ID, OwnerEmail, Tarea, Estado, etc.      │
└─────────────────────────────────────────────────────────┘
```

## 📋 Esquema de Base de Datos

La hoja de Google Sheets contiene las siguientes columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| **ID** | String (UUID) | Identificador único de la tarea |
| **OwnerEmail** | String | Email del propietario (aislamiento) |
| **ID_Padre** | String | ID de la tarea padre (jerarquía) |
| **Tarea** | String | Título/descripción de la tarea |
| **Descripcion** | String | Detalles adicionales |
| **Fecha_Ejecucion** | Date | Fecha programada (ISO format) |
| **Prioridad** | Enum | Alta, Media, Baja |
| **Estado** | Enum | Pendiente, Completada, Descartada |
| **Categoria** | String | Etiqueta de categorización |
| **Interpretar_Comandos** | Boolean | Control de NLP por tarea |
| **CreatedAt** | Timestamp | Fecha de creación |
| **UpdatedAt** | Timestamp | Fecha de última modificación |

## 🚀 Instalación y Setup

### Requisitos Previos:

1. **Cuenta de Google Workspace** del dominio configurado
2. **Permisos en Google Cloud:**
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/userinfo.email`

### Pasos de Instalación:

1. **Crear Google Spreadsheet:**
   ```
   - Crear un nuevo Spreadsheet en Google Sheets
   - Copiar la URL del Spreadsheet
   ```

2. **Crear Proyecto en Google Apps Script:**
   ```
   - Herramientas > Editor de Apps Script (desde el Spreadsheet)
   - Copiar el contenido de Code.gs
   - Copiar el contenido de Index.html como archivo HTML
   ```

3. **Desplegar como Web App:**
   - Ir a Implementar > Implementación nueva
   - Tipo: Web app
   - Ejecutar como: "Usuario que accede"
   - Quién tiene acceso: "Cualquiera dentro de [dominio]"
   - Copiar la URL del deployment

4. **Autorizar la aplicación:**
   - Acceder a la URL desplegada
   - Autorizar los scopes solicitados

## 💡 Cómo Usar

### Crear una Tarea:

1. Escribe el nombre de la tarea en el campo de entrada
2. Opcionalmente, añade tokens NLP:
   - **Prioridad:** `p1` (Alta), `p2` (Media), `p3` (Baja)
   - **Fecha:** `hoy`, `mañana`, nombre del día (ej: `lunes`, `martes`)

**Ejemplo:**
```
"Informe financiero p1 mañana"
→ Tarea: "Informe financiero"
→ Prioridad: Alta
→ Fecha: [Mañana]
```

3. Presiona Enter o haz clic en "Agregar"

### Gestionar Tareas:

- **Marcar como completada:** Haz clic en el círculo de la tarea
- **Editar nombre:** Haz clic en el icono de lápiz
- **Crear subtarea:** Haz clic en el botón "+" de la tarea madre
- **Expandir/Colapsar:** Haz clic en la flecha junto a la tarea madre
- **Filtrar:** Cambia entre "Pendientes" y "Completadas"

### Controlar NLP:

- Haz clic en el botón NLP en el área de entrada para activar/desactivar el parser
- Los chips azules muestran los tokens detectados
- Haz clic en la X del chip para eliminar un token

## 🔒 Seguridad

- **Aislamiento de usuario:** Validación en backend mediante `OwnerEmail`
- **Control de acceso:** Un usuario nunca puede ver ni modificar tareas de otros
- **Lock Service:** Previene condiciones de carrera en operaciones concurrentes
- **Sesión nativa de Google:** Aprovecha la autenticación integrada de Google Workspace

## 🧪 Testing

Consulta los siguientes documentos para validaciones detalladas:

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Casos de prueba manuales con 24+ escenarios
- **[VALIDATION.md](VALIDATION.md)** - Framework de validación funcional y arquitectónico

## 🛠️ Stack Técnico

**Frontend:**
- HTML5
- Vanilla JavaScript (ES6+)
- Tailwind CSS
- NLP Parser integrado

**Backend:**
- Google Apps Script (GAS)
- Google Sheets API
- LockService para concurrencia

**Base de Datos:**
- Google Sheets

## 📊 Rendimiento

- **Optimistic UI:** Actualizaciones instantáneas sin esperar al servidor
- **Caché local:** Estado administrado en el cliente
- **Lazy rendering:** Solo se rerenderiza lo necesario
- **Batch operations:** Minimización de llamadas al backend

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| "Port already in use" | Reinicia el script deployment |
| Tareas de otros usuarios aparecen | Verifica el `OwnerEmail` en backend |
| NLP no detecta tokens | Asegúrate de que el toggle NLP está activo |
| Cambios no se sincronizan | Verifica permisos de Sheets en Google Cloud |
| Subtareas no se muestran | Recarga la página (F5) |

## 📝 Notas de Desarrollo

### Agregar nuevos tokens NLP:

Edita el objeto `NLP_TOKENS` en `Index.html`:

```javascript
const NLP_TOKENS = {
  priorities: {
    'p1': 'Alta',
    'p2': 'Media',
    'p3': 'Baja'
  },
  days: {
    'hoy': 0,
    'mañana': 1,
    'lunes': 1,
    // Agregar más aquí...
  }
};
```

### Personalizar estilos:

Los estilos están en la sección `<style>` de `Index.html`. Usa las clases de Tailwind CSS para personalizaciones rápidas.

## 📄 Licencia

Esta aplicación fue desarrollada como solución de productividad interna para Google Workspace.

## 👥 Soporte

Para reportar bugs o sugerencias de mejora, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026
