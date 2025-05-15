import * as SQLite from 'expo-sqlite';

console.log('SQLite:', SQLite); // <-- Tambahkan ini dulu

const db = SQLite.openDatabaseSync('test.db');

db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT);',
    [],
    () => console.log('Table created'),
    (_, error) => {
      console.log('Error creating table:', error);
      return false;
    }
  );
});
