const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const conString = 'postgres://hare:qwe123@localhost:5432/hare';

// logger 등록
app.use(logger('dev'));

// body-parser 등록
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res) => {
  const client = new pg.Client(conString);
  client.connect();
  const query = client.query('SELECT $1::text as name', ['hare']);
  query.on('row', (row, result) => { result.addRow(row); });
  query.on('end', (result) => { res.send(result.rows); client.end(); });
});

module.exports = app;
