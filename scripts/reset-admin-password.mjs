
import promptSync from "prompt-sync";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prompt = promptSync({ sigint: true });
const db = new PrismaClient();

async function main() {
  const username = prompt("Admin username: ").trim();

  if (!username || username.length > 100) {
    throw new Error("Invalid username.");
  }

  const admin = await db.adminAccount.findUnique({
    where: { username },
    select: { id: true, username: true },
  });

  if (!admin) {
    throw new Error("Admin account not found. No changes made.");
  }

  const password = prompt.hide(
    "New password (12-72 characters): ",
  );
  const confirmation = prompt.hide("Confirm new password: ");

  if (password.length < 12 || password.length > 72) {
    throw new Error("Password must contain 12-72 characters.");
  }

  if (password !== confirmation) {
    throw new Error("Passwords do not match.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();

  await db.$transaction(async (tx) => {
    await tx.adminAccount.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    await tx.adminSession.deleteMany({
      where: { adminId: admin.id },
    });

    await tx.adminToken.updateMany({
      where: {
        adminId: admin.id,
        purpose: "PASSWORD_RESET",
        usedAt: null,
      },
      data: { usedAt: now },
    });
  });

  console.log(`Password updated successfully for ${admin.username}.`);
  console.log("Existing admin sessions have been revoked.");
}

try {
  await main();
} catch (error) {
  console.error(
    "Password reset failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
