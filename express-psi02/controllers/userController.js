var User = require('../models/user');

var async = require('async');

exports.index = function(req, res) {
    res.send('Projeto PSI BE');
};

// Display list of all Users.
exports.user_list = function(req, res, next) {
	User.find().exec(function (err, list_users) {
		if(err) { return next(err) }
		res.send(list_users);
	})
}

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {
	User.findById(req.params.id).exec(function (err, user) {
		if(err) { return next(err) }
		res.send(user)
	})
}

// Handle User create on POST.
exports.user_create_post = function(req, res, next) {
	const user = new User({ user_name: req.body.name, user_pass: req.body.pass });
	user.save((err, user) => {
		if (err) { return next(err)}
		res.send(user);
	})
}

// Handle User delete on POST.
exports.user_delete = function(req, res, next) {
    User.findByIdAndDelete(req.params.id, (err, user) => {
    	if (err) { return next(err)}
    	//res.send('User Deleted');
        res.json();
    })
}

// Display User update form on GET.
exports.user_update = function(req, res) {
    const user = new User({
    	user_name: req.body.name,
        user_pass: req.body.pass,
        user_liked_photos: req.body.liked,
        user_favorited_photos: req.body.favorited,
        user_uploaded_photos: req.body.uploaded,
    	_id: req.params.id
    })
    User.findByIdAndUpdate(req.params.id, user, {}, (err) => {
    	if (err) { return next(err) }
    	//res.send('Updated User')
        res.json();
    })
}