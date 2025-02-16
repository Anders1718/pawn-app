import * as SQLite from 'expo-sqlite'

const databaseName = 'cowdatabasetest5.db';

async function addExtremidadColumnIfNotExists(db) {
    const tableInfo = await db.getAllAsync("PRAGMA table_info(historial_vacas)");
    const extremidadColumnExists = tableInfo.some(column => column.name === 'extremidad');
    
    if (!extremidadColumnExists) {
      await db.execAsync('ALTER TABLE historial_vacas ADD COLUMN extremidad VARCHAR(255)');
    }
}

export async function useRepositories() {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), direccion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    const fincas = await db.getAllAsync('SELECT * FROM fincas ORDER BY id DESC');

    return { fincas: fincas };
}

export async function fetchFincasNombres() {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), direccion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    const fincas = await db.getAllAsync('SELECT * FROM fincas ORDER BY id DESC');

    const nombreFincas = fincas.map(function (item) {
        return { label: item.nombre_finca, value: item.id };
    })

    return nombreFincas;
}


export async function vacasTable() {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), sala VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');

    const vacas = await db.getAllAsync('SELECT * FROM vacas ORDER BY id DESC');

    return { vacas: vacas };
}

export async function fetchVacasId(id) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), sala VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');
    const fincas = await db.getAllAsync(`SELECT * FROM vacas WHERE finca = ${id} ORDER BY id DESC`);

    const nombreVacas = fincas.map(function (item) {
        return { label: item.nombre_vaca, value: item.id, sala: item.sala };
    })

    return nombreVacas;
}

export async function listadoVacasId(id) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), sala VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');
    const vacas = await db.getAllAsync(`SELECT * FROM vacas WHERE finca = ${id} ORDER BY id DESC`);

    return { vacas: vacas };
}

export async function deleteVacasId(id) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), sala VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');
    await db.runAsync('DELETE FROM vacas WHERE id = ?', id);
}

export async function addFinca(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), direccion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    await db.runAsync('INSERT INTO fincas (nombre_finca, nombre_propietario, ubicacion, direccion, telefono, nit) VALUES (?, ?, ?, ?, ?, ?)', values.finca, values.nombre, values.ubicacion, values.direccion, values.tel, values.nit);
}

export async function editFinca(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), direccion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    await db.runAsync('UPDATE fincas SET nombre_finca = ?, nombre_propietario = ?, ubicacion = ?, direccion = ?, telefono = ?, nit = ? WHERE id = ?', values.finca, values.nombre, values.ubicacion, values.direccion, values.tel, values.nit, values.id);
}

export async function deleteFinca(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), direccion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    await db.runAsync('DELETE FROM fincas WHERE id = ?', values.id);

}

export async function addVaca(id, nombre, sala) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), sala VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');

    await db.runAsync('INSERT INTO vacas (nombre_vaca, enfermedades, sala, finca) VALUES (?, ?, ?, ?)', nombre, 'sin enfermedad', sala, id);
}

export async function historialVacas(id) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))'); 
    // Agregar la nueva columna si no existe
    await addExtremidadColumnIfNotExists(db);

    const vacas = await db.getAllAsync(`SELECT * FROM historial_vacas  WHERE finca = ${id} ORDER BY id DESC`);


    return { vacas: vacas };
}

export async function editHistorialVacas(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))');
    
    // Agregar la nueva columna si no existe
    await addExtremidadColumnIfNotExists(db);

    await db.runAsync('UPDATE historial_vacas SET nombre_vaca = ?, enfermedades = ?, fecha = ?, sala = ?, nota = ?, tratamiento = ?, extremidad = ? WHERE id = ?', values.id_animal, values.enfermedades, values.fecha, values.sala, values.nota, values.tratamientos, values.extremidad, values.id);
}

export async function deleteHistorialVacas(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.runAsync('DELETE FROM historial_vacas WHERE id = ?', values.id);
}

export async function ultimaHistoriaVaca(id, nombre_vaca) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))');
    // Agregar la nueva columna si no existe
    await addExtremidadColumnIfNotExists(db);

    const vacas = await db.getAllAsync(`SELECT * FROM historial_vacas WHERE finca = ${id} AND nombre_vaca = ${nombre_vaca} ORDER BY id DESC LIMIT 1`);


    return vacas;
}

export async function addHistorialVacas(id, nombre, enfermedades, fecha, sala, nota, tratamiento, extremidad) {
    const db = await SQLite.openDatabaseAsync(databaseName);

    // Crear la tabla si no existe
    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))');
    // Agregar la nueva columna si no existe
    await addExtremidadColumnIfNotExists(db);
    
    // Insertar nuevo registro con la nueva columna
    await db.runAsync('INSERT INTO historial_vacas (nombre_vaca, enfermedades, fecha, finca, sala, nota, tratamiento, extremidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', nombre, enfermedades, fecha, id, sala, nota, tratamiento, extremidad);
}

export async function addEnfermedades(id, enfermedades) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.runAsync('CREATE TABLE IF NOT EXISTS lista_enfermedades (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_enfermedad VARCHAR(255) NOT NULL, id_enfermedad VARCHAR(255) NOT NULL)');
    await db.runAsync('INSERT INTO lista_enfermedades (nombre_enfermedad, id_enfermedad) VALUES (?, ?)', enfermedades, id);
}

export async function updateEnfermedades(values, idEditPawn) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.runAsync('CREATE TABLE IF NOT EXISTS lista_enfermedades (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_enfermedad VARCHAR(255) NOT NULL, id_enfermedad VARCHAR(255) NOT NULL)');
    await db.runAsync('UPDATE lista_enfermedades SET nombre_enfermedad = ?, id_enfermedad = ? WHERE id = ?', values.nombre, values.id, idEditPawn);
}

export async function deleteEnfermedad(id) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.runAsync('CREATE TABLE IF NOT EXISTS lista_enfermedades (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_enfermedad VARCHAR(255) NOT NULL, id_enfermedad VARCHAR(255) NOT NULL)');
    await db.runAsync('DELETE FROM lista_enfermedades WHERE id = ?', id);
}

export async function fetchEnfermedades() {

    const db = await SQLite.openDatabaseAsync(databaseName);

    const enfermedades = await db.getAllAsync('SELECT * FROM lista_enfermedades');

    const listaEnfermedades = enfermedades.map(function (item) {
        return { label: item.id_enfermedad, value: item.nombre_enfermedad, number: Number(item.id) };
    })

    return listaEnfermedades;
}

export async function fetchHistorialVacas(id, startDate, endDate) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))');
    // Agregar la nueva columna si no existe
    await addExtremidadColumnIfNotExists(db);
    
    const historialVacas = await db.getAllAsync(
        'SELECT * FROM historial_vacas WHERE fecha BETWEEN ? AND ? AND finca = ?',
        [startDate, endDate, id]
    );

    const listaVacas = historialVacas.map(function (item) {
        return { nombre_vaca: item.nombre_vaca, enfermedades: item.enfermedades, fecha: item.fecha, sala: item.sala, nota: item.nota, extremidad: item.extremidad || 'N/A' , tratamiento: item.tratamiento };
    });

    return listaVacas;
}

export async function fetchUsers() {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.getAllAsync('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(255) NOT NULL, telefono VARCHAR(255) NOT NULL, documento VARCHAR(255) NOT NULL, direccion VARCHAR(255) NOT NULL, apellido VARCHAR(255) NOT NULL, profesion VARCHAR(255) NOT NULL, universidad VARCHAR(255) NOT NULL, banco VARCHAR(255) NOT NULL, tipoCuenta VARCHAR(255) NOT NULL, numeroCuenta VARCHAR(255) NOT NULL)');

    const users = await db.getAllAsync('SELECT * FROM user');

    return users;
}

export async function addUser(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.getAllAsync('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(255) NOT NULL, telefono VARCHAR(255) NOT NULL, documento VARCHAR(255) NOT NULL, direccion VARCHAR(255) NOT NULL, apellido VARCHAR(255) NOT NULL, profesion VARCHAR(255) NOT NULL, universidad VARCHAR(255) NOT NULL, banco VARCHAR(255) NOT NULL, tipoCuenta VARCHAR(255) NOT NULL, numeroCuenta VARCHAR(255) NOT NULL)');
    await db.runAsync('INSERT INTO user (nombre, apellido, profesion, universidad, banco, tipoCuenta, numeroCuenta, telefono, documento, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values.nombre, values.apellido, values.profesion, values.universidad, values.banco, values.tipoCuenta, values.numeroCuenta, values.telefono, values.documento, values.direccion);
}

export async function deleteUser(id) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.runAsync('DELETE FROM user WHERE id = ?', id);
}

export async function editUser(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.runAsync('UPDATE user SET nombre = ?, apellido = ?, profesion = ?, universidad = ?, banco = ?, tipoCuenta = ?, numeroCuenta = ?, telefono = ?, documento = ?, direccion = ? WHERE id = ?', values.nombre, values.apellido, values.profesion, values.universidad, values.banco, values.tipoCuenta, values.numeroCuenta, values.telefono, values.documento, values.direccion, values.id);
}