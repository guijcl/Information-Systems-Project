var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PhotoSchema = new Schema(
  {
  	_photo: {type: String, required: true},
    photo_name: {type: String, required: true, maxlength: 100},
    photo_desc: {type: String, required: true, maxlength: 500},
    num_likes: {type: Number, required: true}
  }
);

PhotoSchema
.virtual('name')
.get(function () {
  return this.photo_name;
});

PhotoSchema
.virtual('desc')
.get(function () {
  return this.photo_desc;
});

PhotoSchema
.virtual('likes')
.get(function () {
  return this.num_likes;
});

//Export model
module.exports = mongoose.model('Photo', PhotoSchema);