const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'mydatabase';

const dbConnection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

dbConnection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar o banco de dados:', err);
    return;
  }
  console.log('Banco conectado!');
});

app.get('/', (req, res) => {
  const sql = 'INSERT INTO people (name) VALUES ("teste")';
  dbConnection.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao inserir o nome:', err);
      res.status(500).send('Erro interno');
      return;
    }

    console.log('Nome inserido:', result);

    const selectSql = 'SELECT name FROM people';
    dbConnection.query(selectSql, (err, result) => {
      if (err) {
        console.error('Erro com selecionar os nomes:', err);
        res.status(500).send('Erro interno');
        return;
      }

      const names = result.map((row) => row.name);
      const htmlResponse = `
        <h1>Full Cycle Rocks!</h1>
        <ul>
          ${names.map((name) => `<li>${name}</li>`).join('')}
        </ul>
      `;
      res.send(htmlResponse);
    });
  });
});

app.listen(port, () => {
  console.log(`App rodando http://localhost:${port}`);
});
