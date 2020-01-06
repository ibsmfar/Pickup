const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ObjectId = mongoose.Schema.Types.ObjectId;


const GameRecord = new mongoose.Schema({
    time:{
        type: String,
        //required: true,
        minlength: 1,
        trim: true
    },
    courtName:{
        type: String,
        //required: true,
        minlength: 1,
        trim: true
    }
})
// Schema for users: User(_id, userName, password, game, scheduled, queued)
const RecordSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
        unique: true,      
    },
    games: [GameRecord]
})


// make a model using the User schema
const Record = mongoose.model('Record', RecordSchema)
module.exports = { Record }

