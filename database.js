const mongoose = require('mongoose');

//const URI = process.env.MONGODB_URI || 'mongodb://localhost/api-market';
const URI = "mongodb+srv://krowdy:asdasd@cluster0-sdxqr.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(URI, { useNewUrlParser: true })
  .then(db => console.log('DB esta conectada'))
  .catch(err => console.error(err));

module.exports = mongoose;