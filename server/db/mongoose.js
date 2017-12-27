const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose,
  saveDoc
}

function saveDoc(obj) {
  obj.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
  }, (e) => {
    console.log('Unable to save document:', e);
  });
}
