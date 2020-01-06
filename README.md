## WE are asking for a 24 hour extension. As such please use the last commit made before 10pm on Wednesday Dec 4th for grading purposes.

# team43  
## Access the app here: https://damp-coast-31192.herokuapp.com/

Website for Pickup Games

Instructions:

Access the app by visiting the app url

Use the following credentials for logging in:

User login credentials:
Username:user
Password:user

For additional users:  
user2-10 are available with the corresponding password being the username as well (e.g., username: user3, password: user3)


Admin login credentials:
Username:admin
Password: admin



## User Interactions 

Upon entering their credentials, a user will be directed to the home page. In the home page, a user will be able to see all courts they may join, queue for if it is already fully occupied with 10 players, or schedule a game in the future under the header ‘All Courts’, represented by a court ‘card’ (bottom half). The user status panel at the top of the page under the greeting displays all games that a user is currently in, the courts that user has queued for, and the scheduled games that a user will play in the future. Upon entering the home page for the first time, the user status panel is empty as a user has not made any actions. A user may click their username to see all the pick up games they have joined, and the date of the game. 

### To join a game:  
A user may only join a game if there is space available for them to join. The number of players currently on a court is specified by the number of orange icons inside a court card.

1. If space is available for a court, a user may join by clicking the ‘Join’ button on the court of their choice.
2. Once the ‘Join’ button is clicked, a modal will appear in case the user may want to reconsider joining a court due to its side effects (more on this later). If a user wishes to continue, click ‘Join’ on the modal.
3. A user’s status on the court is confirmed once the court is displayed under _Game you’re currently in_,  in the user status panel at the top of the page. The updated status of the court reflecting the increased amount of players is shown both in the court card under the ‘All Courts’ header, and in the user status panel.

Notice that once a player has joined a game, they may not join or queue for another court. Therefore, if a user is queued for at least one court, upon joining a game, they will be removed from all queues they have joined. A user can only be in a single court at any time. Upon joining a court, a record is made in the User Record page displayed when the username is clicked in the user status panel.

### To leave a game:
If a user is currently in a game (shown in the user status panel), a user may choose to leave a court, opening up a spot for which another user may enter a game at the court.

1. To leave a game, a user must simply press the ‘Leave’ button displayed either in the user status panel under the _Games you’re currently in_ header, or in the corresponding court card under _All Courts_.
2. A modal will appear in case a user may reconsider, in which they may click ‘Close’ and they will remain in the court, or click ‘Leave’ to leave the court for good.
3. The user’s departure will be reflected in the user status, as the court will no longer appear under _Games you’re currently in_. The newly available space made by the user’s departure is reflected in the corresponding court card.

### To join a queue: 
A user may queue for a court only if all 10 spaces have been occupied and don’t mind waiting until a spot opens up for them.

1. A user may queue for a court by clicking the ‘Queue’ on the desired court. 
2. At this point, a user must wait for a court until they have reached the front of the queue (queue position 1) and a spot becomes available in the court (triggered by another user leaving the court at their own discretion). While they are in the queue waiting for a court, the corresponding court is displayed in the user status panel under _Games you’re currently queued for_. 
3. Once there is space available for a user who has queued, they will be notified with a modal specifying which court for which they have now been entered. As with regularly joining the court, their confirmed status on the court is reflected in the user status panel.


Users can also schedule private games where they can pick a time and add the users whom they want to play with (only the person who schedules a private game can add users to a game). This can be done by clicking the 'Schedule' button on the court in which they would like to schedule a game. Scheduling a game would reserve that time slot and disables other users from scheduling a game at the same timeslot (this feature will be realized for phase2 as it requires back end functionality)

The userprofile can be accessed at /userprofile or by clicking on the username in the homepage.

## Admin Interactions:
An admin has the ability to make changes to certain aspects of the app. Once logged in as an admin, the admin dashboard’s home page is reached. From there, the admin can choose from a list of options to make modifications: Users, Courts, and Games:
1. For users, the admin has the ability to change a user’s username and password by pressing the edit button and adding in the new info. The admin can also delete a user from the app
2. For courts, the admin has the power to delete a court if it is no longer used. The admin can also edit its info, such as name, address and its picture. The picture functionality will not work right now since it requires backend services.
3. For games, the admin can look at ongoing, upcoming and scheduled games. The admin cannot make any changes to ongoing games, but can edit or delete upcoming games, and also delete its players. The admin can only delete a scheduled game, since it is privately scheduled and not open to the public.


## Overview of Express Routes

The following Routes are used for by the app:

app.post('/login') - Creates a new user.

app.post('/users/login') - Attempts to log in a user, and create a session. If successful, sends a message to the client that the user is authenticated.

app.post('/admin/login') - Attempts to log in an admin, and create a session. If successful, sends a message to the client that the admin is authenticated, so that the user/admin home page can be rendered.

app.get('/users/logout') - Logs out a user or an admin, destroying the session cookie.

app.get('/users/check-session') - Checks if a user or admin is currently authenticated by checking if a session cookie exists.


### API routes
app.post('/courts') - Create a new court. Used by the admin to manually create a new court.

app.get('/courts') - Retrieve the current state of all courts. Used when a user has done some action (joining, queueing, etc.), requiring all users to update the state of the courts displayed.

app.get('/users') - Retrieve all users. Used by the admin to load all the users and view their information.

app.get(‘/pickup-games’) - Retrieve all the pickup games taking place. Used by admin to load all pickup games and view their info, along with modifying them if needed.

app.get(‘/scheduled-games’) - Same as above, except that this route retrieves all the scheduled games.

app.get(‘/status’) - Used to retrieve a user’s current status, such as what game a user is involved with and/or if the user is part of a queue.

app.get(‘/users/:id’) - Used to retrieve a particular user’s information, such as username, game involved with, queue position etc. User is identified by a unique ID.

app.get(‘/courts/:id’) - Used to retrieve a particular court’s information, such as list of active players, list of queued players, court name and address. Court is identified by a unique ID.

app.patch(‘/courts/:id/pickup’) - User by a user to enter or leave a game. It checks a particular court and determines whether user should by an active player or be placed in a queue.




## Web Sockets
We use web sockets to give all users a real time status of the courts, so that for example information regarding a user adding themselves to a court is instantly visible to all other users. 
The following events are used to achieve the functionality:

‘update court’: is used to update the status of a particular court for all users(clients)

‘update all courts’: is used to update the status of all courts for all users(clients)

‘notify user’: is used to notify a queued user that they can enter a court now.


