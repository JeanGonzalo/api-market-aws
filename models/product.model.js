const mongoose = require('mongoose');
const { Schema } = mongoose;

const productShema = new Schema({
  name: {type: String, required: true},
  owner: { type: String, required: true},
  price: { type: Number, required: true},
  image: { data: String, contentType: String},
  video: { data: String, contentType: String}
});

//Usamos el metodo model para reutilizar el modelo anterior
module.exports = mongoose.model('product', productShema);