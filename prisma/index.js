const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient().$extends({
  model: {
    User: {
      async register(username, password, firstName, lastName, email) {
        const hash = await bcrypt.password.hash(password, 10);
        const user = await prisma.user.create({
          data: { username, firstName, lastName, email, password: hash },
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
