import Database from "tauri-plugin-sql-api";

class DB {
  private ready: Promise<void> | null = null;
  private database: Database | null = null;

  constructor(name: string = "emails.db") {
    this.ready = Database.load(`sqlite:${name}`)
      .then((database) => {
        console.log("database loaded", database);
        return this.setup(database);
      })
      .then((database) => {
        this.database = database;
      });
  }

  async getDatabase() {
    await this.ready;
    return this.database as Database;
  }

  async setup(db: Database) {
    await db.execute(
      `CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        imap_host TEXT NOT NULL,
        imap_port INTEGER NOT NULL,
        smtp_host TEXT NOT NULL,
        smtp_port INTEGER NOT NULL
      )`
    );
    await db.execute(
      `CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account INTEGER NOT NULL,
        sender TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        date TEXT NOT NULL
      )`
    );
    console.info("Database ready");
    return db;
  }

  async execute(query: string, params: any[] = []) {
    const db = await this.getDatabase();
    console.log("executing query", query, params);
    return await db.execute(query, params);
  }

  async select(query: string, params: any[] = []) {
    const db = await this.getDatabase();
    return await db.select(query, params);
  }
}

export default new DB();
