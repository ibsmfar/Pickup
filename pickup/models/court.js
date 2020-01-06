const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const playerValidator = (arr) => {
  return arr.length <= 10;
}

// Court(courtId, courtName, courtAddress, picture, players, queued, gameType)
const CourtSchema = new mongoose.Schema({
  courtName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  courtAddress: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  players: {
    type: [{type: ObjectId, ref: 'User'}],
    validator: playerValidator,
  },
  queued: {
    type: [{type: ObjectId, ref: 'User'}]
  },
  gameType: {
    type: String,
    enum: ['PICK-UP GAME', 'SCHEDULED GAME']
  },
  image: {
    type: String,
    required: true
  }
})

// For finding the first user in a queue of a specified court
CourtSchema.statics.popCourtQueue = function(courtId) {
  const Court = this;

  // Find the correct court and update it
  return Court.findByIdAndUpdate(courtId, {$pop: {queued: -1}})
    .then((oldCourt) => {
      if (!oldCourt) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        const queue = oldCourt.queued;
        if (queue === []) {
          reject();
        } else {
          resolve(queue[0]);
        }
      })
    })
}

// make a model using the Court schema
const Court = mongoose.model('Court', CourtSchema)
module.exports = { Court }
