const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// {
//   email: 'testdev@gmail.com',
//   password: 'some longas hash 0303eca97eacb8789b6cc986ae',
//   tokens: [{
//     access: 'auth',
//     token: 'asjfd;adskfjs;dfjsfsfdfasdf'
//   }]
// }

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    trim: true,
    validate: {
      // validator: (value) => {
      //   return validator.isEmail(value)
      // },
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'salt').toString();

  // user.tokens.push({access, token});
  user.tokens = user.tokens.concat({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'salt');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject('test');
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {

  return User.findOne({email}).then((user) => {

    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      //bcrypt.copmare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {

        if (res === true) {
          resolve(user);
        } else {
          reject();
        }
      });
    });

  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });

  } else {
    next();
  }

});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
