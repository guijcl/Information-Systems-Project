var express = require('express');
var router = express.Router();
var async = require('async');

// Require controller modules.
var user_controller = require('../controllers/userController');
var photo_controller = require('../controllers/photoController');
var User = require('../models/user');
var Photo = require('../models/photo');

router.get('/init', (req, res, next) => {
	async.series(
		deleteDB(),
		userCreate("User1", "Password1"),
		userCreate("User2", "Password2"),
		userCreate("User3", "Password3"),
		userCreate("User4", "Password4"),
		photoCreate("data:image/jpeg;base64,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", "Photo1", "Desc1", 0),
		photoCreate("data:image/jpeg;base64,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", "Photo2", "Desc2", 5)
	)
	res.send('Projeto PSI db recreated')
})

function deleteDB() {
	User.collection.drop();
	Photo.collection.drop();
}

function userCreate(user_name, user_pass) {
  userdetail = {user_name: user_name, user_pass: user_pass, logged_in: false}
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      console.log(`Failed to create User ${user_name}: ${err}`);
      return;
    }
    console.log('New User: ' + user);
  }  );
}

function photoCreate(_photo, photo_name, photo_desc, num_likes) {
  photodetail = {_photo: _photo, photo_name: photo_name, photo_desc: photo_desc, num_likes: num_likes}
  
  var photo = new Photo(photodetail);
       
  photo.save(function (err) {
    if (err) {
      console.log(`Failed to create Photo ${photo_name}: ${err}`);
      return
    }
    console.log('New Photo: ' + photo);
  }  );
}

/// USER ROUTES ///
// GET catalog home page.
router.get('/', user_controller.index);

// PUT request to update User.
router.put('/user/:id', user_controller.user_update);

// DELETE request to delete User.
router.delete('/user/:id', user_controller.user_delete);

// POST request to create User.
router.post('/user', user_controller.user_create_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all Users.
router.get('/users', user_controller.user_list);

/// PHOTO ROUTES ///
// PUT request to update Photo.
router.put('/photo/:id', photo_controller.photo_update);

// DELETE request to delete Photo.
router.delete('/photo/:id', photo_controller.photo_delete);

// POST request to create Photo.
router.post('/photo', photo_controller.photo_create_post);

// GET request for one Photo.
router.get('/photo/:id', photo_controller.photo_detail);

// GET request for list of all Photos.
router.get('/photos', photo_controller.photo_list);

module.exports = router;