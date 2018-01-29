// const expect = require('expect');
const request = require('supertest');
const {expect} = require('chai');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Testing 1 2 3';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).to.equal(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos).to.have.lengthOf(1);
          expect(todos[0].text).to.equal(text);
          done();
        })
        .catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      // .expect((res) => {
      //   expect(res.body.error).to.not.be.empty;
      // })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos).to.have.lengthOf(2);
          done();
        })
        .catch((e) => done(e));
      });
  });

});

describe('GET /todos', () => {

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos).to.have.lengthOf(1);
      })
      .end(done);
  });

});

describe('GET /todos/:id', () => {

  it('should return a todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todos[0].text);
      })
      .end(done);
  });

  it('should not return a todo created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });


  it('should return 404 if todo not found', (done) => {
    var hex12byteID = 'a3a4a5a6a7a8a9a0a9a8a7a6'

    request(app)
      .get(`/todos/${hex12byteID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.todos).to.be.an('undefined');
      })
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    var hexInvalID = 'asdf';

    request(app)
      .get(`/todos/${hexInvalID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.todos).to.be.an('undefined');
      })
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    var hex12byteID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hex12byteID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).to.equal(hex12byteID);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query database using findById, should fail (toNotExist)
        Todo.findById(hex12byteID).then((todo) => {
          expect(todo).to.not.exist;
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not remove a todo', (done) => {
    var hex12byteID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hex12byteID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // query database using findById, should fail (toNotExist)
        Todo.findById(hex12byteID).then((todo) => {
          expect(todo).to.exist;
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hex12byteID = new ObjectID().toHexString;

    request(app)
      .delete(`/todos/${hex12byteID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    var hexInvalID = 'asdf';

    request(app)
      .delete(`/todos/${hexInvalID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.todos).to.be.an('undefined');
      })
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {

  it('should update a todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var newText = "new text"

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text: newText,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).to.exist;
        expect(res.body.todo.text).to.equal(newText);
        expect(res.body.todo.completed).to.equal(true);
        expect(res.body.todo.completedAt).to.be.a('number');
      })
      .end(done);
  });

  it('should not update other user todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var newText = "new text"

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text: newText,
        completed: true
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var newText = 'new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text: newText,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).to.exist;
        expect(res.body.todo.text).to.equal(newText);
        expect(res.body.todo.completed).to.equal(false);
        expect(res.body.todo.completedAt).to.not.exist;
      })
      .end(done);
  });

});

describe('GET /users/me', () => {

  it('should return users if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).to.equal(users[0]._id.toHexString());
        expect(res.body.email).to.equal(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).to.deep.equal({});
        // expect(res.body).to.eql({});
      })
      .end(done);
  });
});

describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'testing123@gmail.com';
    var password = 'testing123password';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body._id).to.exist;
        expect(res.body.email).to.equal(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).to.exist;
          expect(user.password).to.not.equal(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    email = 'testdev@';
    password = 'testdevpassword';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).to.not.exist;
        expect(res.body.name).to.equal('ValidationError');
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).to.be.empty;
          done();
        }).catch((e) => {
          expect(e).to.not.equal(undefined);
          expect(e).to.not.equal(null);
          done();
        });
      });
  });

  it('should not create user if email already taken', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).to.not.exist;
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });
});

describe('POST /users/login', () => {

  it('should login user and return auth token', (done) => {
    email = users[0].email;
    password = users[0].password;

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body._id).to.equal(users[0]._id.toHexString());
        expect(res.body.email).to.equal(email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens[1]).to.include({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    email = users[0].email;
    password = users[0].password + 'asdf';

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).to.not.exist;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens).to.have.lengthOf(1);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('DELETE /users/me/token', () => {

  it('should logout user by removing auth token', (done) => {

    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens).to.be.empty;
          done();
        }).catch((e) => done(e));
      });
  });

});
