const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const TodoApp = db.db('TodoApp');

  // TodoApp.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5a3061377d17b282fb6959cb")
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  TodoApp.collection('Users').findOneAndUpdate({
    name: 'Steve'
  }, {
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });



  // db.close();
});
