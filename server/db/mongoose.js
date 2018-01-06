const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose,
  saveDoc
}

// process.env.NODE_ENV === 'production' // by default on heroku
// process.env.NODE_ENV === 'development' // for locally
// process.env.NODE_ENV === 'test' // for testing

function saveDoc(obj) {
  obj.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
  }, (e) => {
    console.log('Unable to save document:', e);
  });
}
