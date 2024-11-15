# DjStream - Every DJ's dream!

![image](https://github.com/user-attachments/assets/0cecf0ae-2c64-44b0-8eaa-2d9bdf838223)


We are a non-centralized library and offer a private and personalized audio file database designed for DJs. Our users have access to upload audio and mpeg files.

- .mp3
- .mpeg
- .wav
- .mp4
- And other audio formats

Our core features include **Tracks, Edits, Uploads, Playlists**

### Tracks

This is our users' tracklist for all the tracks they own in their library.

- Users can add their tracks to use for their sets.

### Edits

This is their edit list for all the edits they create. Features include:

- Adding audio files
- Change tempo
- Add loops
- Alter pitch

### Uploads

This is our users' upload list for any audio files they have imported into the database.

### Playlists

This is a collection of all of our users' private playlists. Features include:

- Creating new playlists
- Adding tracks to existing playlists
- Updating playlist metadata such as name and description
- Share playlists

### STRETCH GOALS 🔥💿:

- User access to stream music from Spotify and add to their account
  - Use Spotify Dev account to get access and connect to the API to pull users' Spotify data
- Mp4 to mp3 conversion
- Vocal and instrumental extraction using:
  - Web Audio API
  - Spleeter, a Deezer source separation library with pretrained models written in Python and uses Tensorflow.
- Leaderboard for users: social media like interaction, people can vote on public uploads, somebody could have highest rated tracks/edits and show up on top. Uploads and be number 1 on leaderboard for content.
- Have a public feed for users to interact with other users content (algorithm?)

## API ROUTES

### User Authentication Routes

- POST /register creates a new User with the provided credentials and sends a token
  - Request body includes first name, last name, username, password, email.
  - The password is hashed in the database.
- POST /login sends a token if the provided credentials are valid
  - Request body includes username and password

### Users Routes

- 🔒 GET /users sends an array of all users' data
  - Admin access required
- 🔒 GET /users/myprofile sends an array of the logged in user's account information.
- 🔒 GET /users/tracks sends an array of all the tracks owned by the logged in user.
- 🔒 GET /users/playlists sends an array of all the playlists owned by the logged in user, including the tracks on the playlists.
- 🔒 GET /users/:id/edits sends an array of all the edits owned by the logged in user.
- 🔒 GET /users/:id/uploads sends an array of all the uploads owned by the logged in user.
- 🔒 GET /users/:id/tracks/:trackId sends a specific track as long as it is owned by the logged in user
- 🔒 GET /users/:id/playlists/:playlistId sends a specific playlist as long as it is owned by the logged in user
- 🔒 GET /users/:id/edits/:editId sends a a specific edit as long as it is owned by the logged in user
- 🔒 GET /users/:id/uploads/:uploadId sends a specific upload as long as it is owned by the logged in user

### Playlist Routes

- 🔒 GET /playlists sends an array of all playlists entire
  - Admin access required
- 🔒 POST /playlists creates a new playlist with the connected tracks owned by the logged-in user
  - Request body includes the playlist name, description, and track Ids
- 🔒 PATCH /playlists/:id add single or multiple tracks to a specific user-owned playlist
  - Request body includes the track Ids to be added to the playlist
- 🔒 DELETE /playlists/:id deletes the specified playlist by playlist Id only if it is owned by the current user.
  - Knuck If You Buck!

### Track Routes

- 🔒 GET /tracks sends an array of all tracks in the entire database
  - Admin access required
- 🔒 GET /tracks/:id sends an object of a single tracks's metadata as long as it is owned by the logged-in user
- 🔒 POST /tracks adds a track to the database and it is owned by the logged-in user
  - 🗄️ Uses multer to store track metadata in the database. It creates a new name in the database based on the date and time the track is added.
- 🔒 DELETE /tracks/:id deletes the specified track by track Id only if it is owned by the current user.

### Upload Routes

- 🔒 GET /uploads sends an array of all tracks in the entire database
  - Admin access required
- 🔒 POST /uploads adds a new upload to the database and it is owned by the logged in user
  - 🗄️ Uses multer to store upload metadata in the database. It creates a new name in the database based on the date and time the upload is added.
- 🔒 PATCH /uploads/:id updates the name of an upload owned by the user.
- 🔒 DELETE /uploads/:id deletes the specified upload by upload Id only if it is owned by the logged in user.

### Edit Routes

- 🔒 GET /edits sends an array of all edits in the entire database
  - Admin access required
- 🔒 POST /edits adds a new edit to the database and it is owned by the logged in user
  - 🗄️ Uses multer to store edit metadata in the database. It creates a new name in the database based on the date and time the edit is added.
- 🔒 PATCH /edits/:id updates the metadata of an edit as the user works on it based on the edit Id
- 🔒 DELETE /edits/:id deletes an edit from the database based on the edit Id only if it is owned by the logged in user.

## DEPENDENCIES

### Multer

- https://www.npmjs.com/package/multer
- Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
- Stores track metadata in the database. It creates a new name in the database based on the date and time the track is added.

### Express

- https://expressjs.com
- With a myriad of HTTP utility methods and middleware at your disposal, creating a robust API is quick and easy.
- Defined and created an Express app for all of our API routers and server.js file.

### Prisma

- https://www.prisma.io/
- Prisma provides the best experience for your team to work and interact with databases.
  - PrismaClient
  - Prisma migrate
  - Prisma Studio
- Created a database connecting Prisma and PostgreSQL. Also defined Prisma schema to collect metadata from our models through responses and sending requests in our Express routers.

### Faker

- https://fakerjs.dev/
- Generate massive amounts of fake (but realistic) data for testing and development.
- Used Faker to seed our database with temporary data.

### CORS

- https://www.npmjs.com/package/cors
- CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- CORS connected our frontend and backend to complete development.
