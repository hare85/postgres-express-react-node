const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// logger 등록
app.use(logger('dev'));

// body-parser 등록
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'Hello World',
}));

module.exports = app;
