const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {saveDoc} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 8000

app.use(bodyParser.json());

// send every todo
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});


// create a new todo
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    // return if saved
    res.send(doc);
  }, (e) => {
    // return error if fail
    res.status(400).send(e);
  });

});

// GET /todos/<id>
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (todo) {
      res.send({todo});
    }
    else {
      res.status(404).send();
    }
  }).catch((e) => {
    res.status(400).send();
  });

});


// DELETE /todos/<id>
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (todo) {
      res.status(200).send({todo});
    }
    else {
      res.status(404).send();
    }
  }).catch((e) => {
    res.status(400).send();
  });

});

// listen on port forever
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


// make the expressjs app useable by other source
module.exports = {app};
