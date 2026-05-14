require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasourceUrl: `${process.env.DATABASE_URL}`,
  log: ["error", "warn"],
});

module.exports = prisma;