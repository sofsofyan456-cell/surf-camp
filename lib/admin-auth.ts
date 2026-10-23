
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
) {
  const admin = await db.adminAccount.findUnique({
    where: { username: username.trim() },
  });

  if (!admin) {
    return null;
  }

  const passwordIsValid = await compare(password, admin.passwordHash);

  if (!passwordIsValid) {
    return null;
  }

  return admin;
}

export async function createAdminSession(adminId: string) {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000,
  );

  await db.adminSession.create({
    data: {
      tokenHash,
      adminId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  const session = await db.adminSession.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { admin: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await db.adminSession.delete({
      where: { id: session.id },
    });

    cookieStore.delete(COOKIE_NAME);
    return null;
  }

  return session.admin;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(COOKIE_NAME)?.value;

  if (rawToken) {
    await db.adminSession.deleteMany({
      where: { tokenHash: hashToken(rawToken) },
    });
  }

  cookieStore.delete(COOKIE_NAME);
}
