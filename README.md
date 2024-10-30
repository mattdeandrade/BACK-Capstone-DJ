DjStream

We want to create 50 users, each with 50 tracks. Each user has 10 playlists with 5 tracks.

- A track does not have to belong to a playlist.
- Two users CAN NOT access the same playlist.
- ALL USERS ARE ISOLATED MODELS

User 1

- Fakelist 1: A, B, C, D, E
- Fakelist 2: X, Y, Z, A, B, EditS1`
- Tracks: Q, R, S, A, B, C, D, E, X, Y, Z, EditS1`
- Edits: EditQ1, EditR1, EditQ2, EditS1

User 2

- Fakelist 3: J, K, L, M, O
- Fakelist 4: A, B, C, D, Z

GET /tracks all tracks (no frontend use case, admin or dev use only)
GET /tracks/:userId gets all tracks for the signed in user

Seed order:

1. Create users
2. Create tracks to users
3. Create playlists and give them tracks
4. Create edits based on existing tracks for that user
5. Create a track based on an existing edit and add it to that user's tracks
