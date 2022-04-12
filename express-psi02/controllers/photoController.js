var Photo = require('../models/photo');

var async = require('async');

// Display list of all Photos.
exports.photo_list = function(req, res, next) {
	Photo.find().exec(function (err, list_photos) {
		if(err) { return next(err) }
		res.send(list_photos);
	})
}

// Display detail page for a specific Photo.
exports.photo_detail = function(req, res, next) {
	Photo.findById(req.params.id).exec(function (err, photo) {
		if(err) { return next(err) }
		res.send(photo)
	})
}

// Handle Photo create on POST.
exports.photo_create_post = function(req, res, next) {
	const photo = new Photo({ _photo: req.body._photo, photo_name: req.body.name, photo_desc: req.body.desc, num_likes: req.body.likes });
	photo.save((err, photo) => {
		if (err) { return next(err)}
		res.send(photo);
	})
}

// Handle Photo delete on POST.
exports.photo_delete = function(req, res, next) {
    Photo.findByIdAndDelete(req.params.id, (err, photo) => {
    	if (err) { return next(err)}
    	//res.send('Photo Deleted');
        res.json();
    })
}

// Display Photo update form on GET.
exports.photo_update = function(req, res) {
    const photo = new Photo({
        _photo: req.body._photo,
    	photo_name: req.body.name,
        photo_desc: req.body.desc,
        num_likes: req.body.likes,
    	_id: req.params.id
    })
    Photo.findByIdAndUpdate(req.params.id, photo, {}, (err) => {
    	if (err) { return next(err) }
    	//res.send('Updated Photo')
        res.json();
    })
}