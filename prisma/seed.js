const { faker } = require("@faker-js/faker");
const prisma = require("../prisma");

const seed = async (
  numTracks = 50,
  numUsers = 50,
  numPlaylists = 10,
  numEdits = 5
) => {
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.person.fullName(),
    password: faker.internet.password(),
    playlists: { create: playlists },
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  }));

  const tracks = Array.from({ length: numTracks }, () => ({
    trackName: faker.music.songName(),
    artistName: faker.music.artist(),
    albumName: faker.music.album(),
    bpm: Math.floor(Math.random() * (200 - 20 + 1)) + 20,
    genre: faker.music.genre(),
    instrumental: Math.random() < 0.5,
    voc: Math.random() < 0.5,
    userId: Math.floor(Math.random() * numUsers) + 1,
  }));

  const playlists = Array.from({ length: numPlaylists }, () => ({
    name: faker.name.zodiac(),
    description: faker.lorem.sentence(),
    ownerId: Math.floor(Math.random() * 50) + 1,
    tracks: { create: tracks },
  }));

  await prisma.user.createMany({ data: users });

  const playlist = [];
  for (let i = 0; i < numUsers; i++) {
    await prisma.track.create({ data: tracks });
    for (let j = 0; j < numPlaylists; j++) {
      await prisma.playlist.create({
        data: playlists,
      });
    }
  }

  const edits = Array.from({ length: numEdits }, () => ({
    ownerId: Math.floor(Math.random() * 50) + 1,
    trackId: Math.floor(Math.random() * numTracks) + 1,
    trackVocals: Math.random() < 0.5,
    trackInstrumental: Math.random() < 0.5,
    time: Math.floor(Math.random() * (3 * 60 * 1000)),
  }));
};
