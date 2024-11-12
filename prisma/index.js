const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

// Created PrismaClient to read, write, and stream data from our database
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(username, password, firstName, lastName, email, admin) {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { username, firstName, lastName, email, admin, password: hash },
        });
        return user;
      },

      async login(username, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { username },
        });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error("Invalid password");
        return user;
      },
    },
  },
});
module.exports = prisma;
