const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a4341a7210bf7421b916f3b11';
//
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }
//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

User.findById('5a432f0c639e142c95b95b90')
.then((user) => {
  if(!user) {
    return console.log('User Id not found');
  }
  console.log('User by Id:', user);
}).catch((e) => console.log(e));
