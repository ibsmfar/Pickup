const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;

// Schema for users: User(_id, userName, password, game, scheduled, queued)
const UserSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 1
	},
	game: {
		type: ObjectId,
		default: null,
		ref: 'Court',
	},
	scheduled: {
		type: [{type: ObjectId, ref: 'Schedule'}],
	},
	queued: {
		type: [{type: ObjectId, ref: 'Court'}]
	}
})

// Middleware: hash the password
UserSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			})
		})
  } else {
    next();
  }
})

// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByNamePassword = function(name, password) {
	const User = this // binds this to the User model

	// First find the user by their name
	return User.findOne({ userName: name }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

// make a model using the User schema
const User = mongoose.model('User', UserSchema)
module.exports = { User }
