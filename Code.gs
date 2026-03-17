/**
 * Sistema de Gestión de Tareas Pro
 * Backend: Google Apps Script
 */

const SHEET_NAME = 'Tareas';

/**
 * Renderiza la interfaz principal.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Gestión de Tareas Pro')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Inicializa la aplicación cargando el correo del usuario y sus tareas.
 */
function bootstrapApp() {
  const userEmail = Session.getActiveUser().getEmail();
  const tasks = getTasksForUser(userEmail);

  return {
    userEmail: userEmail,
    tasks: tasks,
    config: {
      version: '1.0.0'
    }
  };
}

/**
 * Obtiene las tareas filtradas por el email del usuario.
 */
function getTasksForUser(email) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const rows = data.slice(1);

  const emailIdx = headers.indexOf('OwnerEmail');

  return rows
    .filter(row => row[emailIdx] === email)
    .map(row => {
      const task = {};
      headers.forEach((header, i) => {
        task[header] = row[i];
      });
      // Convertir fechas a strings ISO para el frontend
      if (task.Fecha_Ejecucion instanceof Date) task.Fecha_Ejecucion = task.Fecha_Ejecucion.toISOString();
      if (task.CreatedAt instanceof Date) task.CreatedAt = task.CreatedAt.toISOString();
      if (task.UpdatedAt instanceof Date) task.UpdatedAt = task.UpdatedAt.toISOString();
      return task;
    });
}

/**
 * Crea una nueva tarea.
 */
function createTask(payload) {
  const lock = LockService.getUserLock();
  try {
    lock.waitLock(10000); // 10 segundos

    const sheet = getOrCreateSheet();
    const userEmail = Session.getActiveUser().getEmail();
    const now = new Date();

    const newTaskRow = [
      payload.ID || Utilities.getUuid(),
      userEmail,
      payload.ID_Padre || '',
      payload.Tarea || '',
      payload.Descripcion || '',
      payload.Fecha_Ejecucion ? new Date(payload.Fecha_Ejecucion) : '',
      payload.Prioridad || 'Baja',
      payload.Estado || 'Pendiente',
      payload.Categoria || '',
      payload.Interpretar_Comandos === true,
      now,
      now
    ];

    sheet.appendRow(newTaskRow);

    // Devolvemos el objeto creado para confirmar
    const headers = sheet.getDataRange().getValues()[0];
    const task = {};
    headers.forEach((header, i) => {
      task[header] = newTaskRow[i];
    });

    if (task.Fecha_Ejecucion instanceof Date) task.Fecha_Ejecucion = task.Fecha_Ejecucion.toISOString();
    if (task.CreatedAt instanceof Date) task.CreatedAt = task.CreatedAt.toISOString();
    if (task.UpdatedAt instanceof Date) task.UpdatedAt = task.UpdatedAt.toISOString();

    return { success: true, task: task };
  } catch (e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Actualiza una tarea existente.
 */
function updateTask(payload) {
  const lock = LockService.getUserLock();
  try {
    lock.waitLock(10000);

    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('ID');
    const emailIdx = headers.indexOf('OwnerEmail');
    const userEmail = Session.getActiveUser().getEmail();

    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIdx] === payload.ID && data[i][emailIdx] === userEmail) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) throw new Error('Tarea no encontrada o sin permisos.');

    const now = new Date();
    const rowUpdate = [];
    headers.forEach((header, i) => {
      if (payload.hasOwnProperty(header)) {
        let value = payload[header];
        if (header === 'Fecha_Ejecucion' && value) value = new Date(value);
        rowUpdate.push(value);
      } else if (header === 'UpdatedAt') {
        rowUpdate.push(now);
      } else {
        rowUpdate.push(data[rowIndex-1][i]);
      }
    });

    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowUpdate]);

    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Cambia el estado de una tarea rápidamente.
 */
function setTaskStatus(taskId, status) {
  return updateTask({ ID: taskId, Estado: status });
}

/**
 * Obtiene la hoja de tareas o la crea si no existe.
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'ID', 'OwnerEmail', 'ID_Padre', 'Tarea', 'Descripcion',
      'Fecha_Ejecucion', 'Prioridad', 'Estado', 'Categoria',
      'Interpretar_Comandos', 'CreatedAt', 'UpdatedAt'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}
