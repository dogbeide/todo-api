const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, // must have
    minlength: 1, // min strlen
    trim: true // remove start/end whitespace
  },
  completed: {
    type: Boolean,
    default: false // if not defined
  },
  completedAt: {
    type: Number,
    default: null // explicit nothing
  }
});

module.exports = {Todo};
