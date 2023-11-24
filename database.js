import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("StudentDatabase.db");

const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, lastName TEXT, address TEXT, telephone TEXT);"
    );
  });
};

export { db, initDatabase };
