const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'testdevpassword';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$LpRlDeIGhAM6xc3DNL6YMubyT7zTvxBKlxRWi4IoyRw6GJny01k..';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, 'salt');
// console.log('Token: '+token);
//
// var decoded = jwt.verify(token, 'salt');
// console.log('Decoded: ', decoded);




// var msg = 'I am a plaintext message';
// var hash = SHA256(msg).toString();
//
// console.log(`Message: ${msg}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret random hash salt').toString()
// }
// // token.data.id = 5;
//
// var hashRes = SHA256(JSON.stringify(token.data) + 'secret random hash salt').toString();
// if (hashRes === token.hash) {
//   console.log('Data integrity maintained');
// } else {
//   console.log('Data has been tampered with');
// }
