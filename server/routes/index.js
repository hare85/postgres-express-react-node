const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({ message: 'Welcom to the Todos API!' }));

  app.post('/api/todos', todosController.create);
  // curl -H "Content-Type: application/json" -X POST -d '{"title": "first-todo"}' "http://localhost:8000/api/todos"
  app.get('/api/todos', todosController.list);
  // curl -H "Content-Type: application/json" -X GET "http://localhost:8000/api/todos"
  app.get('/api/todos/:todoId', todosController.retrieve);
  // curl -H "Content-Type: application/json" -X GET "http://localhost:8000/api/todos/1"
  app.put('/api/todos/:todoId', todosController.update);
  // curl -H "Content-Type: application/json" -X PUT -d '{"title": "first-todo, updated"}' "http://localhost:8000/api/todos/1"
  app.delete('/api/todos/:todoId', todosController.destroy);
  // curl -H "Content-Type: application/json" -X DELETE -d '{}' "http://localhost:8000/api/todos/1"

  app.post('/api/todos/:todoId/items', todoItemsController.create);
  // curl -H "Content-Type: application/json" -X POST -d '{"content": "first todo item, inside first todo"}' "http://localhost:8000/api/todos/1/items"
  app.put('/api/todos/:todoId/items/:todoItemId', todoItemsController.update);
  // curl -H "Content-Type: application/json" -X PUT -d '{"content": "first todo item, updated", "complete": true}' "http://localhost:8000/api/todos/1/items/1"
  app.delete('/api/todos/:todoId/items/:todoItemId', todoItemsController.destroy);
  // curl -H "Content-Type: application/json" -X DELETE "http://localhost:8000/api/todos/1/items/1"
};
