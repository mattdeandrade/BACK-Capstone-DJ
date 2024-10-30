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
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  }));
  await prisma.user.createMany({ data: users });

  //   const tracks = Array.from({ length: numTracks }, () => ({
  //     trackName: faker.music.songName(),
  //     artistName: faker.music.artist(),
  //     albumName: faker.music.album(),
  //     bpm: Math.floor(Math.random() * (200 - 20 + 1)) + 20,
  //     genre: faker.music.genre(),
  //     instrumental: Math.random() < 0.5,
  //     voc: Math.random() < 0.5,
  //     time: Math.floor(Math.random() * (3 * 60 * 1000)),
  //     userId: Math.floor(Math.random() * numUsers) + 1,
  //   }));

  for (let i = 0; i < numUsers; i++) {
    await prisma.track.create({
      data: {
        trackName: faker.music.songName(),
        artistName: faker.music.artist(),
        albumName: faker.music.album(),
        bpm: Math.floor(Math.random() * (200 - 20 + 1)) + 20,
        genre: faker.music.genre(),
        instrumental: Math.random() < 0.5,
        voc: Math.random() < 0.5,
        time: Math.floor(Math.random() * (3 * 60 * 1000)),
        userId: Math.floor(Math.random() * numUsers) + 1,
        playlistId: { connect: playlist.id }, // This is just a placeholder so it would let me push
      },
    });

    const playlists = Array.from({ length: numPlaylists }, () => ({
      name: faker.person.jobType(),
      description: faker.lorem.sentence(),
      userId: Math.floor(Math.random() * 50) + 1,
      tracks: { connect: tracks.map((track) => ({ id: track.id })) },
    }));

    for (let j = 0; j < numPlaylists; j++) {
      await prisma.playlist.create({
        data: { playlists },
      });
    }

    const edits = Array.from({ length: numEdits }, () => ({
      ownerId: Math.floor(Math.random() * 50) + 1,
      trackId: Math.floor(Math.random() * numTracks) + 1,
      trackVocals: Math.random() < 0.5,
      trackInstrumental: Math.random() < 0.5,
      time: Math.floor(Math.random() * (3 * 60 * 1000)),
      playlistId: { connect: playlist.id }, // This is just a placeholder so it would let me push
    }));
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
