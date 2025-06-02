// database/Database.js
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'MasehApp.db';
const TABLE_ASSESSMENTS = 'assessments';
const TABLE_APP_SETTINGS = 'app_settings'; // Nama tabel baru untuk pengaturan

let dbInstance = null;

// Fungsi untuk membuka atau mendapatkan koneksi yang sudah ada.
export const openDB = async () => {
  if (dbInstance) {
    console.log('[DB_LOG] Returning existing dbInstance.');
    return dbInstance;
  }
  try {
    console.log('[DB_LOG] Attempting to open database with SQLite.openDatabaseAsync...');
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log('[DB_LOG] SQLite.openDatabaseAsync successful. DB Object Keys:', Object.keys(dbInstance));
    console.log('[DB_LOG] dbInstance path:', dbInstance.databasePath);
    return dbInstance;
  } catch (error) {
    console.error('[DB_LOG] Error opening database with SQLite.openDatabaseAsync:', error);
    throw error;
  }
};

// Fungsi untuk membuat tabel. Dipanggil setelah database berhasil dibuka.
export const createTables = async (db) => {
  if (!db) {
    console.error('[DB_LOG] createTables: db object is null or undefined.');
    throw new Error('Database not opened before creating tables.');
  }
  if (typeof db.execAsync !== 'function') {
    console.error("[DB_LOG] createTables: db.execAsync is NOT a function. Available methods on db:", Object.keys(db));
    throw new Error('db.execAsync is not a function. Cannot create tables.');
  }

  console.log('[DB_LOG] Attempting to create tables using db.execAsync...');
  try {
    // Membuat tabel assessments
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS ${TABLE_ASSESSMENTS} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          assessment_type TEXT NOT NULL,
          score INTEGER,
          category TEXT NOT NULL,
          advice TEXT,
          details TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
    );
    console.log(`[DB_LOG] Table ${TABLE_ASSESSMENTS} SQL executed via db.execAsync.`);

    // Membuat tabel app_settings
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS ${TABLE_APP_SETTINGS} (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT
      );`
    );
    console.log(`[DB_LOG] Table ${TABLE_APP_SETTINGS} SQL executed via db.execAsync.`);

  } catch (error) {
    console.error('[DB_LOG] Error executing CREATE TABLE statements with db.execAsync:', error);
    throw error;
  }
};

// Fungsi utama untuk inisialisasi, dipanggil sekali dari App.js
export const initDatabase = async () => {
  try {
    const db = await openDB();
    await createTables(db);
    console.log('[DB_LOG] Database fully initialized (opened and tables checked/created).');
  } catch (error) {
    console.error('[DB_LOG] Critical error during initDatabase:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan koneksi DB yang sudah diinisialisasi untuk operasi CRUD
export const getDBConnection = async () => {
  if (!dbInstance) {
    console.warn('[DB_LOG] getDBConnection: dbInstance is null, attempting to re-initialize. This might indicate an issue in App.js initialization flow.');
    await initDatabase();
    if (!dbInstance) {
        throw new Error("Failed to get DB connection even after re-initialization attempt.");
    }
  }
  return dbInstance;
};

// --- Fungsi untuk Pengaturan Aplikasi ---
export const setAppSetting = async (key, value) => {
  const db = await getDBConnection();
  if (!db || typeof db.runAsync !== 'function') {
    console.error("[DB_LOG] setAppSetting: Invalid DB object or db.runAsync not a function. DB Keys:", Object.keys(db || {}));
    throw new Error("Invalid DB object or .runAsync not available in setAppSetting");
  }
  const query = `INSERT OR REPLACE INTO ${TABLE_APP_SETTINGS} (key, value) VALUES (?, ?);`;
  console.log(`[DB_LOG] Attempting to save setting: {${key}: ${value}}`);
  try {
    await db.runAsync(query, [key, String(value)]); // Pastikan value disimpan sebagai string jika perlu
    console.log(`[DB_LOG] Setting saved successfully: {${key}: ${value}}`);
  } catch (error) {
    console.error(`[DB_LOG] Error saving setting {${key}: ${value}}:`, error);
    throw error;
  }
};

export const getAppSetting = async (key) => {
  const db = await getDBConnection();
  if (!db || typeof db.getFirstAsync !== 'function') {
    console.error("[DB_LOG] getAppSetting: Invalid DB object or db.getFirstAsync not a function. DB Keys:", Object.keys(db || {}));
    throw new Error("Invalid DB object or .getFirstAsync not available in getAppSetting");
  }
  const query = `SELECT value FROM ${TABLE_APP_SETTINGS} WHERE key = ?;`;
  console.log(`[DB_LOG] Attempting to fetch setting: ${key}`);
  try {
    const result = await db.getFirstAsync(query, [key]);
    console.log(`[DB_LOG] Fetched setting ${key}:`, result);
    return result ? result.value : null; // getFirstAsync mengembalikan objek baris atau undefined/null
  } catch (error) {
    console.error(`[DB_LOG] Error fetching setting ${key}:`, error);
    throw error;
  }
};


// --- Fungsi CRUD untuk assessments (tetap sama) ---
export const addAssessmentResult = async (type, score, category, advice, details = null) => {
  const db = await getDBConnection();
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
