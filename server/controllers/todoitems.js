const TodoItem = require('../models').TodoItem;

const catchError = (err, res) => res.status(400).send(err);
const notFound = res => res.status(404).send({ message: 'TodoItem Not Found' });

module.exports = {
  create(req, res) {
    return TodoItem
      .create({
        content: req.body.content,
        todoId: req.params.todoId,
      })
      .then(todoItem => res.status(201).send(todoItem))
      .catch(err => catchError(err, res));
  },

  update(req, res) {
    return TodoItem
      .find({ where: { id: req.params.todoItemId, todoId: req.params.todoId } })
      .then((todoItem) => {
        if (!todoItem) {
          return notFound(res);
        }
        return todoItem
          // .update({
          //   content: req.body.content || todoItem.content,
          //   complete: req.body.complete || todoItem.complete,
          // })
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedTodoItem => res.status(201).send(updatedTodoItem))
          .catch(err => catchError(err, res));
      })
      .catch(err => catchError(err, res));
  },

  destroy(req, res) {
    return TodoItem
      .find({ where: { id: req.params.todoItemId, todoId: req.params.todoId } })
      .then((todoItem) => {
        if (!todoItem) {
          return notFound(res);
        }
        return todoItem
          .destroy()
          .then(() => res.status(204).send())
          .catch(err => catchError(err, res));
      })
      .catch(err => catchError(err, res));
  },
};
