// const expect = require('expect');
const request = require('supertest');
const {expect} = require('chai');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
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

        Todo.find().then((todos) => {
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
          expect(todos).to.be.empty;
          done();
        })
        .catch((e) => done(e));
      });

  });
});
