const Todo = require('../models').Todo;
const TodoItem = require('../models').TodoItem;

const catchError = (err, res) => res.status(400).send(err);
const notFound = res => res.status(404).send({ message: 'Todo Not Found' });

module.exports = {
  create(req, res) {
    return Todo
      .create({ title: req.body.title })
      .then(todo => res.status(201).send(todo))
      .catch(err => catchError(err, res));
  },

  list(req, res) {
    return Todo
      .findAll({
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then(todos => res.status(200).send(todos))
      .catch(err => catchError(err, res));
  },

  retrieve(req, res) {
    return Todo
      .findById(req.params.todoId, {
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then((todo) => {
        if (!todo) {
          return notFound(res);
        }

        return res.status(200).send(todo);
      })
      .catch(err => catchError(err, res));
  },

  update(req, res) {
    return Todo
      .findById(req.params.todoId, {
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then((todo) => {
        if (!todo) { return notFound(res); }
        return todo
          .update({ title: req.body.title || todo.title })
          .then(() => res.status(200).send(todo))
          .catch(err => catchError(err, res));
      })
      .catch(err => catchError(err, res));
  },

  destroy(req, res) {
    return Todo
      .findById(req.params.todoId, {
        include: [{
          model: TodoItem,
          as: 'todoItems',
        }],
      })
      .then((todo) => {
        if (!todo) { return notFound(res); }
        return todo
          .destroy()
          .then(() => res.status(204).send())
          .catch(err => catchError(err, res));
      })
      .catch(err => catchError(err, res));
  },
};
