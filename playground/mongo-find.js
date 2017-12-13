const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const TodoApp = db.db('TodoApp');

  // TodoApp.collection('Todos').find({
  //   _id: new ObjectID('5a2f6717851c061af2ddf2a1')
  // }).toArray().then((docs) => {
  //   console.log('Todos:');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Failed to fetch Todos collection', err);
  // });

  // TodoApp.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Failed to fetch Todos collection', err);
  // });

  TodoApp.collection('Users').find({name: "David"}).toArray().then((docs) => {
    console.log('All Davids:');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Failed to fetch Users', err);
  });

  // db.close();
});
