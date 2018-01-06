// const expect = require('expect');
const request = require('supertest');
const {expect} = require('chai');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const dummies = [{
  _id: new ObjectID(),
  text: 'Testing 1'
}, {
  _id: new ObjectID(),
  text: 'Testing 2',
  completed: true,
  completedAt: 9999
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(dummies);
  }).then(() => done());
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Testing 1 2 3';

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos).to.have.lengthOf(2);
      })
      .end(done);
  });

});

describe('GET /todos/:id', () => {

  it('should return a todo', (done) => {
    request(app)
      .get(`/todos/${dummies[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(dummies[0].text);
      })
      .end(done);
  });


  it('should return 404 if todo not found', (done) => {
    var hex12byteID = 'a3a4a5a6a7a8a9a0a9a8a7a6'

    request(app)
      .get(`/todos/${hex12byteID}`)
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
      .expect(404)
      .expect((res) => {
        expect(res.body.todos).to.be.an('undefined');
      })
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    var hex12byteID = dummies[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hex12byteID}`)
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

  it('should return 404 if todo not found', (done) => {
    var hex12byteID = new ObjectID().toHexString;

    request(app)
      .delete(`/todos/${hex12byteID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    var hexInvalID = 'asdf';

    request(app)
      .delete(`/todos/${hexInvalID}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.todos).to.be.an('undefined');
      })
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {

  it('should update a todo', (done) => {
    var hexId = dummies[0]._id.toHexString();
    var newText = "new text"

    request(app)
      .patch(`/todos/${hexId}`)
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

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = dummies[1]._id.toHexString();
    var newText = 'new text';

    request(app)
      .patch(`/todos/${hexId}`)
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
