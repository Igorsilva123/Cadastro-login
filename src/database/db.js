import mysql from "mysql";
import dotenv from 'dotenv'
dotenv.config()

const db  = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar: ' + err);
    return;
  }
  console.log('Conexão bem sucedida!');
  return
});

export default db