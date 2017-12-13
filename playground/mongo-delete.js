const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const TodoApp = db.db('TodoApp');

  // // deleteMany
  // TodoApp.collection('Todos').deleteMany({text: 'Prepare for interview'})
  // .then((result) => {
  //   console.log(result);
  // });
  //
  // // deleteOne
  // TodoApp.collection('Todos').deleteOne({text: 'Eat lunch'})
  // .then((result) => {
  //   console.log(result);
  // });

  // // findOneAndDelete
  // TodoApp.collection('Todos').findOneAndDelete({completed: false})
  // .then((result) => {
  //   console.log(result);
  // })

  // TodoApp.collection('Users').deleteMany({name: 'David'})
  // .then((result) => {
  //   console.log(result);
  // });

  TodoApp.collection('Users').findOneAndDelete({_id: new ObjectID("5a2f70e27d17b282fb694cd7")})
  .then((result) => {
    console.log(result);
  });

  // db.close();
});
