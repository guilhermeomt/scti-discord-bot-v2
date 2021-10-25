import sqlite3 from 'sqlite3'
import { Sequelize } from 'sequelize';
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path';

class Database {
  public connection: Sequelize;
  public path: string;


  constructor(folderPath: string) {
    this.path = `${folderPath}/database.sqlite`;

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }

    new sqlite3.Database(this.path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.log(err);
      }
    });
    this.init();
  }

  init(): void {
    this.connection = new Sequelize({
      dialect: 'sqlite',
      storage: this.path,

    });
  }
}

const database: Database = new Database(resolve(__dirname, '../../db'));

export default database;