// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: 'David', age:22};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  TodoApp = db.db('TodoApp');
  // TodoApp.collection('Todos').insertOne({
  //   text: 'Some stuff to get done',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Failed to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // TodoApp.collection('Users').insertOne({
  //   name: 'David',
  //   age: 22,
  //   location: 'Toronto'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Failed to insert user');
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // });

  db.close();
});
