
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const db = new PrismaClient();

async function main() {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  let username;
  let recoveryEmail;
  let password;
  let confirmation;

  try {
    username = (await rl.question("New admin username: ")).trim();
    recoveryEmail = (
      await rl.question("Recovery email: ")
    ).trim().toLowerCase();

    password = await rl.question("Password (12-72 characters): ");
    confirmation = await rl.question("Confirm password: ");
  } finally {
    rl.close();
  }

  if (!/^[a-zA-Z0-9_.-]{3,40}$/.test(username)) {
    throw new Error("Username must be 3-40 valid characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
    throw new Error("Enter a valid recovery email.");
  }

  if (password.length < 12 || password.length > 72) {
    throw new Error("Password must contain 12-72 characters.");
  }

  if (password !== confirmation) {
    throw new Error("Passwords do not match.");
  }

  const existing = await db.adminAccount.findUnique({
    where: { username },
  });

  if (existing) {
    throw new Error("This username already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.adminAccount.create({
    data: {
      username,
      recoveryEmail,
      passwordHash,
    },
  });

  console.log(`Admin "${username}" created successfully.`);
}

main()
  .catch((error) => {
    console.error("Failed to add admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
