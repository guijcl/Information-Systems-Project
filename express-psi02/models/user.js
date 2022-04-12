var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    user_name: {type: String, required: true, minlength: 3},
    user_pass: {type: String, required: true, minlength: 8},
    user_liked_photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}],
    user_favorited_photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}],
    user_uploaded_photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}]
  }
);

UserSchema
.virtual('name')
.get(function () {
  return this.user_name;
});

UserSchema
.virtual('pass')
.get(function () {
  return this.user_pass;
});

UserSchema
.virtual('liked')
.get(function () {
  return this.user_liked_photos;
});

UserSchema
.virtual('favorited')
.get(function () {
  return this.user_favorited_photos;
});

UserSchema
.virtual('uploaded')
.get(function () {
  return this.user_uploaded_photos;
});

UserSchema
.virtual('url')
.get(function () {
  return '/catalog/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);
