# DjStream - Every DJ's dream!

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

### Playlist Routes

- 🔒 GET /playlists sends an array of all playlists
  - Admin access required
- 🔒 POST /playlists creates a new playlist with the connected tracks owned by the logged-in user
  - Request body includes the playlist name, description, and track Ids
- 🔒 PATCH /playlists/:id add single or multiple tracks to a specific user-owned playlist
  - Request body includes the track Ids to be added to the playlist
- 🔒 DELETE /playlists/:id deletes the specified playlist by track Id only if it is owned by the current user.
  - Knuck If You Buck!

### Track Routes

- 🔒 GET /tracks sends an array of all tracks
  - Admin access required
- 🔒 GET /tracks/:id sends an object of a single tracks's metadata as long as it is owned by the logged-in user
- 🔒 POST /tracks adds a track to the database and it is owned by the logged-in user
  - Uses multer to store track metadata in the database. It creates a new name in the database based on the date and time the track is added.

### Upload Routes

### Edit Routes

## DEPENDENCIES

### Multer

- Stores track metadata in the database. It creates a new name in the database based on the date and time the track is added.

### Express

### Prisma

### Faker

### Cors
