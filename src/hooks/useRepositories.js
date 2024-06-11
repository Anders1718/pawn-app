import * as SQLite from 'expo-sqlite'

export async function useRepositories() {

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    const fincas = await db.getAllAsync('SELECT * FROM fincas');

    return { fincas: fincas };
}

export async function fetchFincasNombres() {

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    const fincas = await db.getAllAsync('SELECT * FROM fincas');

    const nombreFincas = fincas.map(function (item) {
        return { label: item.nombre_finca, value: item.id };
    })

    return nombreFincas;
}


export async function vacasTable() {

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');

    const vacas = await db.getAllAsync('SELECT * FROM vacas');

    return { vacas: vacas };
}

export async function fetchVacasId(id) {

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');

    //const fincas = await db.getAllAsync(`SELECT * FROM vacas WHERE id = ${id}`);
    const fincas = await db.getAllAsync(`SELECT * FROM vacas WHERE finca = ${id}`);

    const nombreVacas = fincas.map(function (item) {
        return { label: item.nombre_vaca, value: item.id };
    })

    return nombreVacas;
}

export async function addFinca(values) {

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    await db.runAsync('INSERT INTO fincas (nombre_finca, nombre_propietario, ubicacion, telefono, nit) VALUES (?, ?, ?, ?, ?)', values.finca, values.nombre, values.ubicacion, values.tel, values.nit);
}

export async function addVaca(id, nombre) {

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');

    await db.runAsync('INSERT INTO vacas (nombre_vaca, enfermedades, finca) VALUES (?, ?, ?)', nombre, 'sin enfermedad', id);
}

export async function historialVacas(id) {

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');

    const vacas = await db.getAllAsync(`SELECT * FROM historial_vacas  WHERE finca = ${id}`);


    return { vacas: vacas };
}

export async function addHistorialVacas(id, nombre, enfermedades, fecha) {

    console.log('Entra a db')
    console.log(id, nombre, enfermedades, fecha )

    const db = await SQLite.openDatabaseAsync('databasecowpawn.db');

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');
    console.log('Pasa primera parte')
    await db.runAsync('INSERT INTO historial_vacas (nombre_vaca, enfermedades, fecha, finca) VALUES (?, ?, ?, ?)', nombre, enfermedades, fecha, id);
    console.log('Pasa segunda parte')
    
}
