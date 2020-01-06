const log = console.log

const express = require('express');
//const logger = require("morgan");
// starting the express server
const app = express();
const cors = require('cors');
app.use(cors());

const bcrypt = require('bcryptjs');

// Websocket for live updates
const socket = require('socket.io');

// For sharing session with websocket
const sharedsession = require("express-socket.io-session");

// import the mongoose models
const { User } = require('./models/user');
const { Court } = require('./models/court');
const { Record } = require('./models/record');
const { Admin } = require('./models/admin');

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');


// express-session for managing user sessions
const session = require('express-session');

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//app.use(logger("dev"));

const imageURL = 'http://res.cloudinary.com/dg88pvg0j/image/upload/c_fill,h_400,w_700/'

/*************************************************/
// Express server listening...
const port = process.env.PORT || 3001
const server = app.listen(port, () => {
	log(`Listening on port ${port}...`)
})

/*** Session handling **************************************/
// Create a session cookie
app.session = session({
    secret: 'oursecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
        httpOnly: true
    }
});
app.use(app.session);
const io = socket(server);
io.use(sharedsession(app.session));

/*********************************************************/
// Socket configuration

io.on('connection', (socket) => {
	const session = socket.handshake.session;
	socket.join(`${session.user}`);
});
/*********************************************************/

// Create a new user
app.post('/login', (req, res) => {

	// Create a new user
	const user = new User({
		userName: req.body.userName,
		password: req.body.password
	})

	// Save the user
	user.save().then((user) => {
		res.send(user)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})

// app.post('/admin/create', (req, res) => {
//
// 	// Create a new user
// 	const admin = new Admin({
// 		userName: req.body.userName,
// 		password: req.body.password
// 	})
//
// 	// Save the user
// 	admin.save().then((admin) => {
// 		res.send(admin);
// 	}, (error) => {
// 		res.status(400).send(error) // 400 for bad request
// 	})
// })


// A route to login and create a session
app.post('/users/login', (req, res) => {
	const username = req.body.username
  const password = req.body.password

    // Use the static method on the User model to find a user
    // by their email and password
	User.findByNamePassword(username, password).then((user) => {
	    if (!user) {
	    	log('User not found')
        res.send({screen: 'unauthorized'});
        } else {
            // Add the user's id to the session cookie.
            // We can check later if this exists to ensure we are logged in.
						req.session.user = user._id;
						req.session.type = 'user';
						res.send({screen: 'user_auth'});
        }
    }).catch((error) => {
		  res.send({screen: 'unauthorized'});
    })
})

// A route to login and create a session
app.post('/admin/login', (req, res) => {
	const username = req.body.username
  const password = req.body.password

    // Use the static method on the Admin model to find an admin
    // by their email and password
	Admin.findByNamePassword(username, password).then((admin) => {
	    if (!admin) {
	    	log('Admin not found')
        res.send({screen: 'unauthorized'});
        } else {
            // Add the admin's id to the session cookie.
            // We can check later if this exists to ensure we are logged in.
						req.session.user = admin._id;
						req.session.type = 'admin';
						res.send({screen: 'admin_auth'});
			  }
    }).catch((error) => {
		  res.send({screen: 'unauthorized'});
    })
})

// A route to logout a user
app.get('/users/logout', (req, res) => {
	// Remove the session
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.send("Session destroyed");
		}
	})
})

// A route to check if a use is logged in on the session cookie
app.get('/users/check-session', (req, res) => {
	// Remove the session
	if (req.session.user && req.session.type === 'user') {
      res.send({screen: 'user_auth'});
  } else if (req.session.user && req.session.type === 'admin') {
			res.send({screen: 'admin_auth'});
	} else {
      res.send({screen: 'unauthorized'});
  }
})

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user, '_id').then((user) => {
			if (!user) {

				Admin.findById(req.session.user, '_id').then((admin) => {
					if (!admin) {
						return Promise.reject();
					} else {
						req.user = admin;
						next();
					}
				})
				.catch((error) => {
					res.status(401).send("Unauthorized")
				})

			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.status(401).send("Unauthorized")
		})
	} else {
		res.status(401).send("Unauthorized")
	}
}



/*********************************************************/

/*** API Routes below ************************************/

// For formatting court in a way that hides user information
const formatUpdatedCourt = (updatedCourt) => {
	const formattedCourt = updatedCourt.toObject();
	formattedCourt.players = updatedCourt.players.length;
	formattedCourt.queued = updatedCourt.queued.length;
	formattedCourt.image = imageURL + updatedCourt.image;
	return formattedCourt;
}

const formatUpdatedUser = (updatedUser) => {
  const formattedUser = updatedUser.toObject();
  return formattedUser;
}

// A POST route to create a new court
app.post('/courts', authenticate, (req, res) => {

	// Create a new court
	const court = new Court({
		courtName: req.body.courtName,
		courtAddress: req.body.courtAddress,
		players: [],
		queued: [],
		gameType: 'PICK-UP GAME',
		image: req.body.image
	})

	court.save().then((result) => {
    console.log("No error");
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})

// A GET route to retrieve all courts (with all required information)
app.get('/courts', authenticate, (req, res) => {

  // Replace arrays with its size, and add full image url
  Court.find().then((allCourts) => {
    const modifiedCourts = allCourts.map((court) => {
      const courtObj = court.toObject();
      courtObj.players = courtObj.players.length;
      courtObj.queued = courtObj.queued.length;
      courtObj.image = imageURL + court.image;
      return courtObj
    })
    res.send(modifiedCourts);
  }).catch(err => {
    res.status(500).send(err) // server error
  })
})

app.get('/users', authenticate, (req, res) => {
  User.find().then((users) => {
    const allUsers = users.map((user) => {
      const userObj = user.toObject();
      return userObj
    })
    res.send(allUsers)
  }).catch(err => {
    res.status(500).send(err)
  })
})

app.get('/pickup-games', authenticate, (req, res) => {
  Court.find({gameType: "PICK-UP GAME"}).then((games) => {
    const allGames = games.map((game) => {
      const gameObj = game.toObject();
      return gameObj
    })
    res.send(allGames)
  }).catch(err => {
    res.status(500).send(err)
  })
})

app.get('/scheduled-games', authenticate, (req, res) => {
  Court.find({gameType: "SCHEDULED GAME"}).then((games) => {
    const allGames = games.map((game) => {
      const gameObj = game.toObject();
      return gameObj
    })
    res.send(allGames)
  }).catch(err => {
    res.status(500).send(err)
  })
})

// A GET route to retrieve a user's current status
// app.get('/users/:id', (req, res) => {

//   // Retrieve a users id
//   const userId = req.params.id;

//   if (!ObjectID.isValid(userId)) {
//     res.status(404).send();
//   }

//   User.findById(userId, 'userName game scheduled queued')
//      .populate('queued', '_id queued')
//       .then((returned) => {
//         const userInfo = returned.toObject();
//         const formatQueued = returned.queued.map((court) => {
//           const formatted = {
//             courtId: court._id,
//             queuePosition: court.queued.indexOf(userId) + 1
//           }
//           return formatted;
//         })
//         userInfo.queued = formatQueued;
//         res.send(userInfo);
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).send(err);
//       })
// })

// A GET route to retrieve a user's current status
app.get('/status', authenticate, (req, res) => {

  // Retrieve a users id
  const userId = req.user._id;

  if (!ObjectID.isValid(userId)) {
    res.status(404).send();
  }

  User.findById(userId, 'userName game scheduled queued')
     .populate('queued', '_id queued')
      .then((returned) => {
        const userInfo = returned.toObject();
        const formatQueued = returned.queued.map((court) => {
          const formatted = {
            courtId: court._id,
            queuePosition: court.queued.indexOf(userId) + 1
          }
          return formatted;
        })
        userInfo.queued = formatQueued;
        res.send(userInfo);
      })
      .catch(err => {
        res.status(500).send(err);
      })
})

// A GET route to retrieve a single user
app.get('/users/:id', authenticate, (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    res.status(404).send()
	}

  User.findById(id).then((user) => {
    if (!user) {
      res.status(404).send()
    } else {
      const formattedUser = formatUpdatedUser(user);
      res.send(formattedUser);
    }
  }).catch(err => {
    res.status(500).send(err);
  })
})


// A GET route to retrieve a single court
app.get('/courts/:id', authenticate, (req, res) => {
  const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

  Court.findById(id).then((court) => {
    if (!court) {
      res.status(404).send()
    } else {
			const formattedCourt = formatUpdatedCourt(court);
      res.send(formattedCourt);
    }
  }).catch(err => {
    res.status(500).send(err);
  })
})

// A PATCH route to enter/leave a court (by joining a game)
app.patch('/courts/:id/pickup', authenticate, (req, res) => {

  // Find court and check whether to queue/enter court
  const userId = req.user._id;
  const enter = req.body.enter;
  const courtId = req.params.id;

  if (!ObjectID.isValid(userId) && !ObjectID.isValid(courtId)) {
		res.status(404).send()
	}

  if (enter === true) {
    Court.findByIdAndUpdate(courtId, {$push: {players: userId}}, {new:true})
      .then((updatedCourt) => {
          User.findByIdAndUpdate(userId, {game: courtId}, {new:true})
          .then(updatedUser => {
            const user = {
              game: updatedUser.game,
              scheduled: updatedUser.scheduled,
              queued: updatedUser.queued,
            }
						const formattedCourt = formatUpdatedCourt(updatedCourt);
            res.send(user);
						io.emit('update court', formattedCourt); // Tell all users to update all courts
          }).catch(err => {
            res.status(400).send(err);
          })
      })
      .catch(err => {
        res.status(400).send(err) // 400 for bad request
      });
  } else {
    Court.findByIdAndUpdate(courtId, {$pull: {players: userId}}, {new: true})
      .then((updatedCourt) => {
         User.findByIdAndUpdate(userId, {game: null}, {new: true})
          .then((updatedUser) => {
            const user = {
              game: updatedUser.game,
              scheduled: updatedUser.scheduled,
              queued: updatedUser.queued,
            }
						const formattedCourt = formatUpdatedCourt(updatedCourt);
            res.send(user)
						io.emit('update court', formattedCourt); // Tell all users to update this modified court

						// Pop queue and notify user that they may enter
						if (formattedCourt.queued > 0) {
							Court.popCourtQueue(courtId)
								.then((userId) => {
									User.findByIdAndUpdate(userId, {$pull: {queued: courtId}})
										.then((user) => {
											// Notify user that they may enter the queue
											io.to(`${userId}`).emit('notify user', `${courtId}`);
										})
										.catch(error => {
											res.status(500).send(error);
										})
								})
								.catch(error => {
									res.status(500).send(error);
								})
						}
          }).catch(err => {
            res.status(400).send(err);
          })
      })
      .catch(err => {
        res.status(400).send(err) // 400 for bad request
      });
  }
})

app.patch('/pickup/remove-user', authenticate, (req, res) => {
  const gameId = req.body.gameId
  const allPlayers = req.body.allPlayers
  const userId = req.body.removedPlayer

  console.log(gameId);
  console.log(userId);
  console.log(allPlayers);

  if (!ObjectID.isValid(gameId)) {
    res.status(404).send()
  }

  if (!ObjectID.isValid(userId)) {
    res.status(404).send()
  }

  Court.findByIdAndUpdate(gameId, {players: allPlayers}, {new: true})
  .then((updatedCourt) => {
    User.findByIdAndUpdate(userId, {game: null}, {new: true})
    .then((updatedUser) => {
    })
    .catch(error => {
      res.status(400).send(error)
    })
  })
  .catch(error => {
    res.status(400).send(error)
  })
})

app.patch('/scheduled/remove-user', authenticate, (req, res) => {
  const gameId = req.body.gameId
  const allPlayers = req.body.allPlayers
  const userId = req.body.removedPlayer

  if (!ObjectID.isValid(gameId)) {
    res.status(404).send()
  }

  if (!ObjectID.isValid(userId)) {
    res.status(404).send()
  }

  Court.findByIdAndUpdate(gameId, {players: allPlayers}, {new: true})
  .then((updatedCourt) => {
    User.findByIdAndUpdate(userId, {game: null}, {new: true})
    .then((updatedUser) => {
      res.send(updatedUser)
    })
    .catch(error => {
      res.status(400).send(error)
    })
  })
  .catch(error => {
    res.status(400).send(error)
  })
})

// A PATCH route to change credentials of a user
app.patch('/users/:id/admin', authenticate, (req, res) => {

  const userId = req.params.id;
  var new_username = req.body.username;
  var new_password = req.body.password;
  var hashed_password;

  if (!ObjectID.isValid(userId)) {
    res.status(404).send()
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(new_password, salt, (err, hash) => {
      User.findByIdAndUpdate(userId, {userName: new_username, password: hash}, {new:true})
      .then((updatedUser) => {
        console.log(updatedUser);
        // const formattedUser = formatUpdatedUser(updatedUser)
        // io.emit('update user', formattedUser)
      }).catch((error) => {
        res.status(400).send(error)
      })
    })
  })
})

app.delete('/users/remove/admin', authenticate, (req, res) => {
  const userId = req.body.userId

  if (!ObjectID.isValid(userId)) {
    res.status(404).send()
  }

  User.findByIdAndRemove(userId).then((user) => {
    if (!user) {
      res.status(404).send()
    } else {
      res.send(user)
    }
  }).catch((error) => {
    res.status(500).send()
  })
})

app.patch('/games/remove/admin', authenticate, (req, res) => {
  const gameId = req.body.gameId
  const allPlayers = []

  if (!ObjectID.isValid(gameId)) {
    res.status(404).send()
  }

  Court.findByIdAndUpdate(gameId, {players: allPlayers, queued: allPlayers, gameType: null}, {new: true})
  .then((updatedCourt) => {
    res.send(updatedCourt)
  })
  .catch(error => {
    res.status(400).send(error)
  })
})

app.patch('/users/remove-game/admin', authenticate, (req, res) => {
  const players = req.body.players
  const queued = req.body.queued

  console.log(players);
  console.log(queued);

  if (!ObjectID.isValid(gameId)) {
    res.status(404).send()
  }

  for (var i = 0; i < players.length; i++) {
    User.findByIdAndUpdate(players[i], {game: null}, {new: true})
      .then((updatedUser) => {
        res.send(updatedUser)
      })
      .catch(error => {
        res.status(400).send(error)
      })
  }

  for (var j = 0; j < players.length; j++) {
    User.findByIdAndUpdate(queued[j], {game: null}, {new: true})
      .then((updatedUser) => {
        res.send(updatedUser)
      })
      .catch(error => {
        res.status(400).send(error)
      })
  }
})

app.delete('/courts/remove/admin', authenticate, (req, res) => {
  const courtId = req.body.courtId

  if (!ObjectID.isValid(courtId)) {
    console.log("No Court Id");
    res.status(404).send()
  }

  Court.findByIdAndRemove(courtId).then((court) => {
    if (!court) {
      console.log("Court Not found");
      res.status(404).send()
    } else {
      res.send(court)
    }
  }).catch((error) => {
    console.log(error);
    res.status(500).send()
  })
})

// A PATCH route to remove all queues they are currently in
app.patch('/courts/all/queue', authenticate, (req, res) => {

  // Obtain user id
  const userId = req.user._id;

  if (!ObjectID.isValid(userId)) {
		res.status(404).send()
	}

  Court.updateMany({queued: userId}, {$pull: {queued: userId}})
    .then((query) => {
      User.findByIdAndUpdate(userId, {queued: []}, {new: true})
        .then((updatedUser) => {
          const user = {
            game: updatedUser.game,
            scheduled: updatedUser.scheduled,
            queued: updatedUser.queued,
          }
          res.send(user);
					io.emit('update all courts'); // Tell all users to update all courts
        }).catch(err => {
          res.status(404).send(err);
        })
    })
    .catch(err => {
      res.status(404).send(err);
    })
})

// A PATCH route to enter/leave queue
app.patch('/courts/:id/queue', authenticate, (req, res) => {

  // Obtain operation parameters
  const userId = req.user._id;
  const enter = req.body.enter;
  const courtId = req.params.id;

  if (!ObjectID.isValid(userId) && !ObjectID.isValid(courtId)) {
		res.status(404).send()
	}

  if (enter === true) {
    Court.findByIdAndUpdate(courtId, {$push: {queued: userId}}, {new: true})
      .then((updatedCourt) => {
        User.findByIdAndUpdate(userId, {$push: {queued: courtId}}, {new: true})
          .then((updatedUser) => {
            const user = {
              game: updatedUser.game,
              scheduled: updatedUser.scheduled,
              queued: updatedUser.queued,
            }
						const formattedCourt = formatUpdatedCourt(updatedCourt);
            res.send(user);
						io.emit('update court', formattedCourt); // Tell all users to update this modified court
						i
          }).catch(err => {
            res.status(400).send(err);
          })
      })
        .catch(err => {
          res.status(400).send(err) // 400 for bad request
        });
  } else {
    Court.findByIdAndUpdate(courtId, {$pull: {queued: userId}}, {new: true})
      .then((updatedCourt) => {
        User.findByIdAndUpdate(userId, {$pull: {queued: courtId}}, {new: true})
          .then((updatedUser) => {
            const user = {
              game: updatedUser.game,
              scheduled: updatedUser.scheduled,
              queued: updatedUser.queued,
            }
						const formattedCourt = formatUpdatedCourt(updatedCourt);
            res.send(user);
						io.emit('update court', formattedCourt); // Tell all users to update this modified court
          }).catch(err => {
            res.status(400).send(err);
          })
      })
        .catch(err => {
          res.status(400).send(err) // 400 for bad request
        });
  }
})

//adds a new user to the record collection
app.post('/records/addUser', authenticate, (req, res) => {
  // will be req.session.user.userName/userid after
  //const userId = req.user._id;
  const userId = req.user._id

  const userRec = new Record({
          userId: userId,
          games:[]
        })
  userRec.save().then((results) =>{
          res.send(results)
        }, (error) =>{
          res.status(400).send(error)
        })
})
// adds a record to the games for an existing user
app.post('/records/addRecord', authenticate, (req, res) => {
  // will be req.session.user.userName/userid after
  const userId = req.user._id

  const time = req.body.time;
  const courtName = req.body.courtName;

  const record = {
    time: time,
    courtName: courtName
  }

  Record.find({userId:userId}).then((userRecord) => {
    if (!userRecord){
      res.status(404).send()
    } else {
        userRecord[0].games.push(record);

        userRecord[0].save((err) => {
         if(err) res.status(500).send(err)
        })

        res.send(userRecord)
   }
  }).catch((err)=>{
    res.status(400).send(err)
  })

})

app.get('/records', authenticate, (req, res) => {
  // will eventually take id out of URL and instead use session information
  const userId = req.user._id;

  Record.find({userId:userId}).then((userRecord) => {
    if (!userRecord){
      res.status(404).send()
    } else {
        //userRecord[0].games.push(record);

        // userRecord[0].save((err) => {
        //  if(err) res.status(500).send(err)
        // })

        res.send(userRecord[0].games)
   }
  }).catch((err)=>{
    res.status(400).send(err)
  })

})

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(__dirname + "/client/build"));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
})
