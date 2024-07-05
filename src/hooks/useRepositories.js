import * as SQLite from 'expo-sqlite'

const databaseName = 'cowdatabasetest4.db';

export async function useRepositories() {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    const fincas = await db.getAllAsync('SELECT * FROM fincas ORDER BY id DESC');

    return { fincas: fincas };
}

export async function fetchFincasNombres() {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

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

    //const fincas = await db.getAllAsync(`SELECT * FROM vacas WHERE id = ${id}`);
    const fincas = await db.getAllAsync(`SELECT * FROM vacas WHERE finca = ${id} ORDER BY id DESC`);

    const nombreVacas = fincas.map(function (item) {
        return { label: item.nombre_vaca, value: item.id, sala: item.sala };
    })

    return nombreVacas;
}

export async function addFinca(values) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS fincas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_finca VARCHAR(255) NOT NULL, nombre_propietario VARCHAR(255) NOT NULL, ubicacion VARCHAR(255), telefono VARCHAR(255), nit VARCHAR(150))');

    await db.runAsync('INSERT INTO fincas (nombre_finca, nombre_propietario, ubicacion, telefono, nit) VALUES (?, ?, ?, ?, ?)', values.finca, values.nombre, values.ubicacion, values.tel, values.nit);
}

export async function addVaca(id, nombre, sala) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), sala VARCHAR(255), finca INT, FOREIGN KEY (finca) REFERENCES fincas(id))');

    await db.runAsync('INSERT INTO vacas (nombre_vaca, enfermedades, sala, finca) VALUES (?, ?, ?, ?)', nombre, 'sin enfermedad', sala, id);
}

export async function historialVacas(id) {

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))');

    const vacas = await db.getAllAsync(`SELECT * FROM historial_vacas  WHERE finca = ${id} ORDER BY id DESC`);


    return { vacas: vacas };
}

export async function addHistorialVacas(id, nombre, enfermedades, fecha, sala, nota, tratamiento) {

    console.log('Entra a db')
    console.log(id, nombre, enfermedades, fecha, sala, nota, tratamiento)

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))');
    await db.runAsync('INSERT INTO historial_vacas (nombre_vaca, enfermedades, fecha, finca, sala, nota, tratamiento) VALUES (?, ?, ?, ?, ?, ?, ?)', nombre, enfermedades, fecha, id, sala, nota, tratamiento);
    
}

export async function addEnfermedades(id, enfermedades) {

    console.log('Entra a db')
    console.log(id, enfermedades)

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.runAsync('CREATE TABLE IF NOT EXISTS lista_enfermedades (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_enfermedad VARCHAR(255) NOT NULL, id_enfermedad VARCHAR(255) NOT NULL)');
    await db.runAsync('INSERT INTO lista_enfermedades (nombre_enfermedad, id_enfermedad) VALUES (?, ?)', enfermedades, id);
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
    console.log(id, startDate, endDate);

    const db = await SQLite.openDatabaseAsync(databaseName);

    await db.execAsync('CREATE TABLE IF NOT EXISTS historial_vacas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_vaca VARCHAR(255) NOT NULL, enfermedades VARCHAR(255), fecha DATE, finca INT, sala VARCHAR(255), nota VARCHAR(255), tratamiento VARCHAR(255), FOREIGN KEY (finca) REFERENCES fincas(id))');
    
    const historialVacas = await db.getAllAsync(
        'SELECT * FROM historial_vacas WHERE fecha BETWEEN ? AND ? AND finca = ?',
        [startDate, endDate, id]
    );

    console.log(historialVacas);

    const listaVacas = historialVacas.map(function (item) {
        console.log(typeof item.fecha);
        return { nombre_vaca: item.nombre_vaca, enfermedades: item.enfermedades, fecha: item.fecha, sala: item.sala, nota: item.nota, tratamiento: item.tratamiento };
    });

    return listaVacas;
}