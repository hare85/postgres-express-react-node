# project setting

## Express 설치

- Express와 필요 미들웨어를 설치한다.

  > Express 4.x부터는 [미들웨어](Middleware) 최소한의 기능만 갖추고 나머지는 추가로 설치해야 함.

  ```bash
  npm i -S express body-parser morgan
  ```

  [body-parser](body-parser), [morgan](morgan)은 [서드파티 미들웨어](Third-party-middleware)이며 body-parser는 req의 body내용을 읽기 위해 morgan은 logger로 추가한다.

## Express 기본 서버 작성

- server/app.js 작성

  ```js
  const express = require('express');
  const logger = require('morgan');
  const bodyParser = require('body-parser');

  const app = express();

  // logger 등록
  app.use(logger('dev'));

  // body-parser 등록
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('*', (req, res) => res.status(200).send({
    message: 'Hello World',
  }));

  module.exports = app;

  ```

- server/main.js 작성
  ```js
  const http = require('http');
  const app = require('./app');

  const port = parseInt(process.env.PORT, 10) || 8000;
  app.set('port', port);

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log('listening on port', port);
  });

  ```

- nodemon 설치

  원활한 테스트를 위해 nodemon설치 서버 코드가 바뀌어 저장될 때 마다 서버를 재실행 시켜준다.

  `npm i -D nodemon`

- 서버 실행

  `nodemon ./server/main.js`

- TEST

  `curl localhost:8000 //=>{"message":"Hello World"}`

# postgres 작성

- 설치

  `npm i -S pg`

- 계정생성

  `createuser -P {username}`

- app.js 수정

  간단하게 client생성 후 접속해서 쿼리를 실행해 본다.

  ```diff
  const bodyParser = require('body-parser');
  +const pg = require('pg');

  const app = express();
  +const conString = 'postgres://hare:qwe123@localhost:5432/hare';

  -app.get('*', (req, res) => res.status(200).send({
  -  message: 'Hello World',
  -}));
  +app.get('*', (req, res) => {
  +  const client = new pg.Client(conString);
  +  client.connect();
  +  const query = client.query('SELECT $1::text as name', ['hare']);
  +  query.on('row', (row, result) => { result.addRow(row); });
  +  query.on('end', (result) => { res.send(result.rows); client.end(); });
  +});
  ```

# Sequelize 적용

[Sequelize.js](http://docs.sequelizejs.com/en/latest/)는 Node.js 기반의 ORM (Object-Releational-Mapping)이다.
데이터 마이그레이션을 생성하는데도 도움이 된다.

- Sequelize CLI 설치

  프로젝트에 Sequelize를 구성하기 위해 Sequelize cli를 글로벌로 설치한다.

  `npm i -g sequelize-cli`

- Sequelize rc 작성

  프로젝트 루트 폴더에 설정 파일을 작성한다. 해당 설정에서 Sequelize에 필요한 파일의 경로를 지정한다.

  ```js
  const path = require('path')

  module.exports = {
    'config':          path.resolve('server', 'config', 'database.json'),
    'migrations-path': path.resolve('server', 'migrations'),
    'models-path':     path.resolve('server', 'models'),
    'seeders-path':    path.resolve('server', 'seeders'),
  }
  ```

- Sequelize 패키지 의존성 모듈 설치

  `npm i -S sequelize pg pg-hstore`

- sequelize init을 통해 rc에 지정한 폴더를 만듦

  `sequelize init`

- 자동 생성된 server/models/index.js 는 ES5 구문이기 때문에 ES6로 리펙토링 한다.

  ```js
  const fs = require('fs');
  const path = require('path');
  const Sequelize = require('sequelize');
  let config = require('../config/database.json');

  const basename = path.basename(module.filename);
  const env = process.env.NODE_ENV || 'development';
  config = config[env];
  const db = {};

  let sequelize;
  if (config.use_env_constiable) {
    sequelize = new Sequelize(process.env[config.use_env_constiable]);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  fs
    .readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  module.exports = db;
  ```

- db추가

  `createdb hare-dev`

- server/config/database.json에 db설정
  ```json
  {
    "development": {
      "username": "hare",
      "password": "qwe123",
      "database": "hare-dev",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "test": {
      "username": "hare",
      "password": "qwe123",
      "database": "hare-test",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "production": {
      "username": "hare",
      "password": "qwe123",
      "database": "hare-release",
      "host": "127.0.0.1",
      "dialect": "postgres"
    }
  }

  ```

- 모델 생성

  Todo, TodoItem을 만든다.

  ```bash
  sequelize model:create --name Todo --attributes title:string
  sequelize model:create --name TodoItem --attributes content:string,complete:boolean
  ```

  이렇게 하면 server/models폴더에는 todo.js, todoitem.js가,
  sever/migrations에는 <date>-create-todo.js, <date>-create-todo-item.js 마이그레이션 파일이 생성 된다.

  생성된 model코드는 ES5 스타일이고 ES6형태로 리펙토링 하고, todo와 todo-item의 관계를 정의한다.

- sequelize 마이그레이션

  `sequelize db:migrate`


[Middleware]: http://expressjs.com/ko/guide/using-middleware.html
[Third-party-middleware]: http://expressjs.com/en/resources/middleware.html
[body-parser]: http://expressjs.com/en/resources/middleware/body-parser.html
[morgan]: http://expressjs.com/en/resources/middleware/morgan.html