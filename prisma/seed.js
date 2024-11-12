const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Define effect types for edits data to use
const effectNames = [
  "Reverb",
  "Echo",
  "Chorus",
  "Distortion",
  "Flanger",
  "Phaser",
  "Pitch Shift",
  "High Pass Filter",
  "Low Pass Filter",
  "Compression",
  "Equalization",
  "Vibrato",
  "Auto-Tune",
];

/** SEED DATABASE WITH FAKER */

// Initialize number of tracks per playlist, tracks per user, number of users, number of playlists, and number of edits
const seed = async (
  numTracksPerPlaylist = 50,
  numTracksPerUser = 5, //changed variable name to associate correct reference
  numUsers = 50,
  numPlaylists = 50,
  numEdits = 5
) => {
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.username(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  }));
  await prisma.user.createMany({ data: users });

  // These 4 variables are used to define userIds and userNames for connecting seed data
  const userRecords = await prisma.user.findMany({ select: { id: true } }); ///fetch Id from autoincrement to match with userId relation.
  const userIds = userRecords.map((user) => user.id);
  const userName = await prisma.user.findMany({ select: { username: true } });
  const userNames = userName.map((user) => user.username);

  const tracks = []; //init tracks array
  for (let i = 0; i < numTracksPerUser; i++) {
    const track = await prisma.track.create({
      data: {
        trackName: faker.music.songName(),
        artistName: faker.music.artist(),
        albumName: faker.music.album(),
        bpm: Math.floor(Math.random() * (200 - 20 + 1)) + 20,
        genre: faker.music.genre(),
        instrumental: Math.random() < 0.5,
        vocals: Math.random() < 0.5,
        duration: Math.floor(Math.random() * (3 * 60 * 1000)),
        user: {
          connect: { id: userIds[Math.floor(Math.random() * userIds.length)] },
        },
      },
    });
    tracks.push(track); //create tracks
  }

  const playlists = [];
  for (let i = 0; i < numPlaylists; i++) {
    const playlist = await prisma.playlist.create({
      data: {
        name: faker.person.jobType(),
        description: faker.lorem.sentence(),
        user: {
          connect: { id: userIds[Math.floor(Math.random() * userIds.length)] },
        },
      },
    });
    playlists.push(playlist); //create playlists
  }

  for (const playlist of playlists) {
    //put numTracksPerPlaylist tracks in a playlist of playlists[] numPlaylist times
    const tracks = Array.from({ length: numTracksPerPlaylist }, () => ({
      trackName: faker.music.songName(),
      artistName: faker.music.artist(),
      albumName: faker.music.album(),
      bpm: Math.floor(Math.random() * (200 - 20 + 1)) + 20,
      genre: faker.music.genre(),
      instrumental: Math.random() < 0.5,
      vocals: Math.random() < 0.5,
      duration: Math.floor(Math.random() * (3 * 60 * 1000)),
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      playlistId: playlist.id,
    }));
    // Seeds tracks
    await prisma.track.createMany({ data: tracks });
  }

  const minPitch = 329.63;
  const maxPitch = 440;
  for (let i = 0; i < numEdits; i++) {
    // Seeds edits
    await prisma.edit.create({
      data: {
        userId: Math.floor(Math.random() * numUsers) + 1,
        vocals: Math.random() < 0.5,
        instrumental: Math.random() < 0.5,
        duration: Math.floor(Math.random() * (3 * 60 * 1000)),
        pitch: Math.floor(Math.random() * (maxPitch - minPitch) + minPitch),
        bpm: Math.floor(Math.random() * (200 - 20 + 1)) + 20,
        genre: faker.music.genre(),
        loop: Math.random() < 0.5,
        effects: effectNames[Math.floor(Math.random() * effectNames.length)],
        editName: faker.internet.color(),
        artistName: userNames[Math.floor(Math.random() * userNames.length)],
      },
    });
  }
};

// Runs seed function and then disconnects
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
