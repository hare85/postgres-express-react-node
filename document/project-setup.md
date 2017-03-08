# project setting

## Express 설치

- Express와 필요 미들웨어를 설치한다.

  > Express 4.x부터는 [미들웨어](Middleware) 최소한의 기능만 갖추고 나머지는 추가로 설치해야 함.

  ```bash
  npm i -S express body-parser morgan
  ```

  [body-parser](body-parser), [morgan](morgan)은 [서드파티 미들웨어](Third-party-middleware)이며 body-parser는 req의 body내용을 읽기 위해 morgan은 logger로 추가한다.


[Middleware]: http://expressjs.com/ko/guide/using-middleware.html
[Third-party-middleware]: http://expressjs.com/en/resources/middleware.html
[body-parser]: http://expressjs.com/en/resources/middleware/body-parser.html
[morgan]: http://expressjs.com/en/resources/middleware/morgan.html