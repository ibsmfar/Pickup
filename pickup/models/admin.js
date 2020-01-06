const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;

// Schema for admins: Admin(_id, userName, password);
const AdminSchema = new mongoose.Schema({
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
})

// Middleware: hash the password
AdminSchema.pre('save', function(next) {
  const admin = this;

  if (admin.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(admin.password, salt, (err, hash) => {
				admin.password = hash;
				next();
			})
		})
  } else {
    next();
  }
})

// Allows us to find an Admin document by comparing the hashed password
//  to a given one, for example when logging in.
AdminSchema.statics.findByNamePassword = function(name, password) {
	const Admin = this // binds this to the Admin model

	// First find the admin by their name
	return Admin.findOne({ userName: name }).then((admin) => {
		if (!admin) {
			return Promise.reject()  // a rejected promise
		}
		// if the admin exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, admin.password, (err, result) => {
				if (result) {
					resolve(admin)
				} else {
					reject()
				}
			})
		})
	})
}

// make a model using the Admin schema
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = { Admin }
