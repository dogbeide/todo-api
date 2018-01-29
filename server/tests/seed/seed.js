const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userID1 = new ObjectID();
const userID2 = new ObjectID();

const users = [{
  _id: userID1,
  email: 'testdev@gmail.com',
  password: 'testdevpassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userID1, access: 'auth'}, 'salt').toString()
  }]
}, {
  _id: userID2,
  email: 'devtest@gmail.com',
  password: 'devtestpassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userID2, access: 'auth'}, 'salt').toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'Testing 1',
  _creator: userID1
}, {
  _id: new ObjectID(),
  text: 'Testing 2',
  completed: true,
  completedAt: 9999,
  _creator: userID2
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var user1 = new User(users[0]).save();
    var user2 = new User(users[1]).save();

    // Promise.all([user1, user2]).then(() => {
    //
    // });
    return Promise.all([user1, user2])
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
