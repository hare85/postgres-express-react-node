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

  ```JavaScript
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
  ```JavaScript
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

[Middleware]: http://expressjs.com/ko/guide/using-middleware.html
[Third-party-middleware]: http://expressjs.com/en/resources/middleware.html
[body-parser]: http://expressjs.com/en/resources/middleware/body-parser.html
[morgan]: http://expressjs.com/en/resources/middleware/morgan.html