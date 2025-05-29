// database/Database.js
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'MasehApp.db';
let
 
dbInstance = null; // Kita akan simpan instance DB di sini setelah berhasil dibuka

// Fungsi ini HANYA untuk membuka atau mendapatkan koneksi yang sudah ada.
// Inisialisasi tabel dilakukan terpisah.
export const openDB = async () => {
  if (dbInstance) {
    console.log('[DB_LOG] Returning existing dbInstance.');
    return dbInstance;
  }
  try {
    console.log('[DB_LOG] Attempting to open database with SQLite.openDatabaseAsync...');
    // Untuk expo-sqlite versi baru (SDK 50+), openDatabaseAsync mengembalikan objek database secara langsung
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log('[DB_LOG] SQLite.openDatabaseAsync successful. DB Object Keys:', Object.keys(dbInstance));
    console.log('[DB_LOG] dbInstance path:', dbInstance.databasePath); // Cek path
    return dbInstance;
  } catch (error) {
    console.error('[DB_LOG] Error opening database with SQLite.openDatabaseAsync:', error);
    throw error;
  }
};

// Fungsi untuk membuat tabel. Dipanggil setelah database berhasil dibuka.
export const createTables = async (db) => { // `db` adalah instance yang sudah dibuka
  if (!db) {
    console.error('[DB_LOG] createTables: db object is null or undefined.');
    throw new Error('Database not opened before creating tables.');
  }
  if (typeof db.execAsync !== 'function') {
    console.error("[DB_LOG] createTables: db.execAsync is NOT a function. Available methods on db:", Object.keys(db));
    throw new Error('db.execAsync is not a function. Cannot create tables.');
  }

  console.log('[DB_LOG] Attempting to create table using db.execAsync...');
  try {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS assessments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          assessment_type TEXT NOT NULL,
          score INTEGER,
          category TEXT NOT NULL,
          advice TEXT,
          details TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
    );
    console.log('[DB_LOG] Table assessments SQL executed via db.execAsync.');
  } catch (error) {
    console.error('[DB_LOG] Error executing CREATE TABLE with db.execAsync:', error);
    throw error;
  }
};

// Fungsi utama untuk inisialisasi, dipanggil sekali dari App.js
export const initDatabase = async () => {
  try {
    const db = await openDB(); // Buka atau dapatkan koneksi
    await createTables(db);    // Buat tabel menggunakan koneksi tsb
    console.log('[DB_LOG] Database fully initialized (opened and tables checked/created).');
  } catch (error) {
    console.error('[DB_LOG] Critical error during initDatabase:', error);
    throw error; // Lempar error agar App.js bisa menangani
  }
};

// Fungsi untuk mendapatkan koneksi DB yang sudah diinisialisasi untuk operasi CRUD
// Ini akan dipanggil oleh screen Anda sebelum melakukan operasi add, get, dll.
export const getDBConnection = async () => {
  if (!dbInstance) {
    // Ini seharusnya tidak terjadi jika initDatabase() sudah dipanggil dari App.js dengan benar.
    // Namun, sebagai fallback, kita coba inisialisasi.
    console.warn('[DB_LOG] getDBConnection: dbInstance is null, attempting to re-initialize. This might indicate an issue in App.js initialization flow.');
    await initDatabase(); // initDatabase akan mengisi dbInstance
    if (!dbInstance) { // Jika masih null setelah re-inisialisasi
        throw new Error("Failed to get DB connection even after re-initialization attempt.");
    }
  }
  return dbInstance;
};


// Fungsi CRUD sekarang akan memanggil getDBConnection untuk mendapatkan instance `db`
export const addAssessmentResult = async (type, score, category, advice, details = null) => {
  const db = await getDBConnection(); // Dapatkan instance DB yang valid
  if (!db || typeof db.runAsync !== 'function') {
    console.error("[DB_LOG] addAssessmentResult: Invalid DB object or db.runAsync not a function. DB Keys:", Object.keys(db || {}));
    throw new Error("Invalid DB object or .runAsync not available in addAssessmentResult");
  }
  console.log('[DB_LOG] Using db.runAsync for addAssessmentResult...');
  try {
    const result = await db.runAsync(
      `INSERT INTO assessments (assessment_type, score, category, advice, details)
       VALUES (?, ?, ?, ?, ?);`,
      [type, score, category, advice, details ? JSON.stringify(details) : null]
    );
    console.log('[DB_LOG] Assessment result added, Last Insert ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('[DB_LOG] Error in addAssessmentResult with db.runAsync:', error);
    throw error;
  }
};

export const getAllAssessmentResults = async () => {
  const db = await getDBConnection();
  if (!db || typeof db.getAllAsync !== 'function') {
    console.error("[DB_LOG] getAllAssessmentResults: Invalid DB object or db.getAllAsync not a function. DB Keys:", Object.keys(db || {}));
    throw new Error("Invalid DB object or .getAllAsync not available in getAllAssessmentResults");
  }
  console.log('[DB_LOG] Using db.getAllAsync for getAllAssessmentResults...');
  try {
    const results = await db.getAllAsync(`SELECT * FROM assessments ORDER BY timestamp DESC;`);
    return results;
  } catch (error) {
    console.error('[DB_LOG] Error in getAllAssessmentResults with db.getAllAsync:', error);
    throw error;
  }
};

export const getAssessmentResultById = async (id) => {
  const db = await getDBConnection();
  if (!db || typeof db.getFirstAsync !== 'function') {
    console.error("[DB_LOG] getAssessmentResultById: Invalid DB object or db.getFirstAsync not a function. DB Keys:", Object.keys(db || {}));
    throw new Error("Invalid DB object or .getFirstAsync not available in getAssessmentResultById");
  }
  console.log('[DB_LOG] Using db.getFirstAsync for getAssessmentResultById...');
  try {
    const result = await db.getFirstAsync(`SELECT * FROM assessments WHERE id = ?;`, [id]);
    return result || null;
  } catch (error) {
    console.error(`[DB_LOG] Error in getAssessmentResultById for id ${id} with db.getFirstAsync:`, error);
    throw error;
  }
};