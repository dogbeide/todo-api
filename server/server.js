const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {saveDoc} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

});

app.listen(8000, () => {
  console.log('Started on port 8000');
});

// var newTodo = new Todo({
//   text: 'Go to bed'
// });
//
// saveDoc(newTodo);
//
// var newTodo2 = new Todo({
//   text: 'Sleep tho',
//   completed: true,
//   completedAt: 9999
// });
//
// saveDoc(newTodo2);

// user1 = new User({
//   email: 'testdev@gmail.com'
// });
//
// saveDoc(user1);

module.exports = {app};
