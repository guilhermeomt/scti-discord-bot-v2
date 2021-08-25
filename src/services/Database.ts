import sqlite3 from 'sqlite3'
import { resolve } from 'path';

export const db = new sqlite3.Database(resolve(__dirname, '../../db/database.sqlite'), (err) => {
  if (err) {
    console.log(err);
  }
});

