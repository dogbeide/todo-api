require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {saveDoc} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

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

// create a new user
app.post('/users', (req, res) => {
  // var body = _.pick(req.body, ['email', 'password']);
  // var user = new User(body);
  var user = new User(
    _.pick(req.body, ['email', 'password'])
  );

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});


// POST /users/login {email, password}
app.post('/users/login', (req, res) => {

  User.findByCredentials(req.body.email, req.body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send("Successfully logged out");
  }).catch((e) => {
    res.status(400).send("Error logging out");
  });
});

// return self profile
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
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

// PATCH /todos/<id>
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.send(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  })
  .catch((e) => {
    res.status(400).send();
  });

});


// listen on port forever
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


// make the expressjs app useable by other source
module.exports = {app};
