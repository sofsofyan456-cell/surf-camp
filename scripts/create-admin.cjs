const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const db = new PrismaClient();

function askHidden(prompt) {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      reject(new Error("Run this script in an interactive terminal."));
      return;
    }

    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();

    let answer = "";

    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
    }

    function onData(chunk) {
      for (const char of chunk.toString()) {
        if (char === "\u0003") {
          cleanup();
          reject(new Error("Input cancelled."));
          return;
        }

        if (char === "\r" || char === "\n") {
          cleanup();
          resolve(answer);
          return;
        }

        if (char === "\u007f" || char === "\b") {
          answer = answer.slice(0, -1);
        } else if (char >= " ") {
          answer += char;
        }
      }
    }

    stdin.on("data", onData);
  });
}

async function main() {
  const count = await db.adminAccount.count();

  if (count !== 0) {
    throw new Error("An admin account already exists. Setup stopped.");
  }

  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  let username;
  let recoveryEmail;

  try {
    username = (await rl.question("Admin username: ")).trim();
    recoveryEmail = (
      await rl.question("Recovery email: ")
    ).trim().toLowerCase();
  } finally {
    rl.close();
  }

  const password = await askHidden("Password (hidden): ");
  const confirmation = await askHidden("Confirm password (hidden): ");

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

  const passwordHash = await bcrypt.hash(password, 12);

  // Prevent creating a second account if another process won the race.
  if ((await db.adminAccount.count()) !== 0) {
    throw new Error("An admin account now exists. Setup stopped.");
  }

  await db.adminAccount.create({
    data: {
      username,
      recoveryEmail,
      passwordHash,
    },
  });

  console.log("Initial admin account created successfully.");
}

main()
  .catch((error) => {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
