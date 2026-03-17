# 🛠️ Guía de Flujo de Trabajo

## Herramientas utilizadas
- **clasp** → Sincronizar código local ↔ Google Apps Script
- **Jules** → Agente de IA para hacer cambios específicos al código

---

## Parte 1: clasp — Subir y bajar cambios a Google Apps Script

### Instalación (primera vez)

```bash
npm install -g @google/clasp
clasp login
```

### Estructura del proyecto con clasp

Asegúrate de tener un archivo `.clasp.json` en la raíz del proyecto:

```json
{
  "scriptId": "TU_SCRIPT_ID_AQUI",
  "rootDir": "."
}
```

> Puedes encontrar el `scriptId` en Google Apps Script: 
> **Configuración del proyecto → ID del script**

---

### Comandos esenciales

| Comando | Qué hace |
|---------|----------|
| `clasp pull` | Descarga los cambios desde Google Apps Script al local |
| `clasp push` | Sube los archivos locales a Google Apps Script |
| `clasp push --force` | Sube ignorando advertencias |
| `clasp deploy` | Crea un nuevo deployment de la Web App |
| `clasp deploy --deploymentId <id>` | Actualiza un deployment existente |
| `clasp open` | Abre el proyecto en el editor de GAS en el navegador |
| `clasp logs` | Muestra los logs recientes del script |

---

### Flujo básico de trabajo

```bash
# 1. Antes de empezar, bajar última versión
clasp pull

# 2. Hacer cambios en Code.gs o Index.html (localmente)

# 3. Subir los cambios
clasp push

# 4. Si tienes un deployment ya creado, actualizarlo
clasp deploy --deploymentId <ID_DEL_DEPLOYMENT> --description "v1.x - descripcion"
```

### Ver tus deployments activos

```bash
clasp deployments
```

Output de ejemplo:
```
- AKfycby... @1 - Web App (activo)
```

---

## Parte 2: Jules — Agente de IA para cambios en el código

Jules es el agente de Google que puede hacer cambios automáticos en tu repositorio de forma asíncrona.

### Prerrequisitos

- Proyecto conectado a un repositorio de **GitHub**
- Acceso a [jules.google.com](https://jules.google.com)
- CLI de Jules instalado (si usas `jules remote pull`)

---

### Flujo de trabajo con Jules

#### 1. Crear una tarea en Jules

En la interfaz web de Jules:

1. Selecciona el repositorio `tareas-pro`
2. Haz clic en **"New Task"**
3. Escribe una descripción clara y específica del cambio (ver consejos abajo)
4. Jules trabaja de forma asíncrona mientras tú haces otras cosas

#### 2. Bajar los cambios de Jules al local

Cuando Jules termina, puedes revisar los cambios en la web o bajarlos con:

```bash
# Descargar cambios de una sesión específica
jules remote pull --session <SESSION_ID>
```

El `SESSION_ID` se obtiene desde la interfaz web de Jules al finalizar la tarea.

#### 3. Revisar los cambios

```bash
# Ver qué archivos modificó Jules
git diff

# Ver el diff detallado de un archivo
git diff Index.html
git diff Code.gs
```

#### 4. Aplicar y subir a Google Apps Script

```bash
# Si los cambios están bien, subir a GAS
clasp push

# Si necesitas actualizar el deployment activo
clasp deploy --deploymentId <ID> --description "fix: descripcion del cambio"
```

#### 5. Descartar cambios de Jules (si no te convencen)

```bash
git checkout .
```

---

### Cómo escribir buenas tareas para Jules

Jules funciona mejor cuando las instrucciones son **precisas, acotadas y con contexto técnico**.

#### ✅ Ejemplos de buenas instrucciones

```
En Index.html, añade la opción de editar la fecha y prioridad de una tarea 
directamente desde la tarjeta, sin usar prompt(). Usa un input inline que 
aparezca al hacer click en el valor actual.
```

```
En Code.gs, crea una función deleteTask(taskId) que elimine la fila de 
Google Sheets cuyo ID coincida con taskId, validando que el OwnerEmail 
sea el del usuario activo antes de borrar.
```

```
En la función renderApp() de Index.html, corrige el bug donde el contador 
de tareas pendientes muestra 0 aunque haya tareas en la lista. El contador 
está en el header.
```

#### ❌ Instrucciones que Jules no resolverá bien

```
# Demasiado vago:
"Mejora la app"

# Sin contexto de arquitectura:
"Agrega autenticación"  ← ya existe integrada en GAS

# Múltiples cambios no relacionados en una sola tarea:
"Arregla el NLP, añade dark mode y mejora el rendimiento"
```

---

### Flujo completo de ejemplo

```bash
# Situación: Jules añadió la función deleteTask y cambios en el frontend

# 1. Bajar cambios de Jules
jules remote pull --session 11836886847902757931

# 2. Revisar
git diff Code.gs
git diff Index.html

# 3. Probar localmente si es posible, luego subir a GAS
clasp push

# 4. Actualizar deployment
clasp deployments                               # ver IDs disponibles
clasp deploy --deploymentId AKfycby... --description "feat: delete task"

# 5. Confirmar cambios en git
git add .
git commit -m "feat: delete task via Jules"
git push
```

---

## Resumen rápido

```
Jules (cambios IA) ──► jules remote pull ──► revisar con git diff
                                                       │
                                                  clasp push
                                                       │
                                             clasp deploy (actualizar URL)
```
