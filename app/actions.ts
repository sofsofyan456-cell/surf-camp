// filepath: app/actions.ts
"use server";
import { put } from "@vercel/blob";
import { db } from "../lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createHash, randomBytes } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { sendPasswordResetEmail } from "../lib/email";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  verifyAdminCredentials,
} from "../lib/admin-auth";

// --- AUTHENTICATION ACTIONS ---

export async function login(username: string, password: string) {
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password ||
    username.length > 100 ||
    password.length > 1024
  ) {
    return { success: false, error: "Invalid username or password" };
  }

  try {
    const admin = await verifyAdminCredentials(username, password);

    if (!admin) {
      return { success: false, error: "Invalid username or password" };
    }

    await createAdminSession(admin.id);
    return { success: true };
  } catch (error) {
    console.error("Admin login failed:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

export async function logout() {
  await destroyAdminSession();
  revalidatePath("/admin");
}


const RESET_PURPOSE = "PASSWORD_RESET";
const RESET_TOKEN_MINUTES = 15;

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string) {
  const genericResponse = {
    success: true,
    message:
      "If this email is registered, a password reset link will be sent.",
  };

  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return genericResponse;
  }

  let tokenRecordId: string | null = null;

  try {
    const admin = await db.adminAccount.findUnique({
      where: { recoveryEmail: email.trim().toLowerCase() },
    });

    if (!admin) return genericResponse;

    const now = new Date();

    // Invalidate older unused reset links for this administrator.
    await db.adminToken.updateMany({
      where: {
        adminId: admin.id,
        purpose: RESET_PURPOSE,
        usedAt: null,
      },
      data: { usedAt: now },
    });

    const rawToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(
      now.getTime() + RESET_TOKEN_MINUTES * 60 * 1000,
    );

    const tokenRecord = await db.adminToken.create({
      data: {
        tokenHash: hashResetToken(rawToken),
        purpose: RESET_PURPOSE,
        adminId: admin.id,
        expiresAt,
      },
    });

    tokenRecordId = tokenRecord.id;

    const appUrl = process.env.APP_URL?.replace(/\/+$/, "");

    if (!appUrl) {
      throw new Error("APP_URL is not configured.");
    }

    const resetUrl = new URL(
      `/admin/reset-password?token=${encodeURIComponent(rawToken)}`,
      `${appUrl}/`,
    ).toString();

    await sendPasswordResetEmail(admin.recoveryEmail, resetUrl);

    return genericResponse;
  } catch (error) {
    console.error("Password reset request failed:", error);

    // Prevent a link from remaining usable if email delivery fails.
    if (tokenRecordId) {
      try {
        await db.adminToken.updateMany({
          where: { id: tokenRecordId, usedAt: null },
          data: { usedAt: new Date() },
        });
      } catch (cleanupError) {
        console.error("Failed to invalidate reset token:", cleanupError);
      }
    }

    return genericResponse;
  }
}

export async function resetAdminPassword(
  token: string,
  newPassword: string,
) {
  if (
    typeof token !== "string" ||
    !/^[a-f0-9]{64}$/.test(token) ||
    typeof newPassword !== "string" ||
    newPassword.length < 12 ||
    newPassword.length > 72
  ) {
    return {
      success: false,
      error: "Use a valid reset link and a password between 12 and 72 characters.",
    };
  }

  try {
    const tokenHash = hashResetToken(token);
    const now = new Date();

    const tokenRecord = await db.adminToken.findUnique({
      where: { tokenHash },
    });

    if (
      !tokenRecord ||
      tokenRecord.purpose !== RESET_PURPOSE ||
      tokenRecord.usedAt ||
      tokenRecord.expiresAt.getTime() <= now.getTime()
    ) {
      return {
        success: false,
        error: "This reset link is invalid, expired, or already used.",
      };
    }

    const passwordHash = await hash(newPassword, 12);

    const resetSucceeded = await db.$transaction(async (tx) => {
      // Atomically claim the token so it cannot be used twice.
      const claimed = await tx.adminToken.updateMany({
        where: {
          id: tokenRecord.id,
          purpose: RESET_PURPOSE,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      });

      if (claimed.count !== 1) return false;

      await tx.adminAccount.update({
        where: { id: tokenRecord.adminId },
        data: { passwordHash },
      });

      // Revoke existing sessions after a successful password reset.
      await tx.adminSession.deleteMany({
        where: { adminId: tokenRecord.adminId },
      });

      // Invalidate any other unused reset links for this account.
      await tx.adminToken.updateMany({
        where: {
          adminId: tokenRecord.adminId,
          purpose: RESET_PURPOSE,
          usedAt: null,
        },
        data: { usedAt: now },
      });

      return true;
    });

    if (!resetSucceeded) {
      return {
        success: false,
        error: "This reset link is invalid, expired, or already used.",
      };
    }

    return {
      success: true,
      message: "Password reset successfully. You can now log in.",
    };
  } catch (error) {
    console.error("Password reset failed:", error);
    return {
      success: false,
      error: "Could not reset the password. Please try again.",
    };
  }
}


export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string" ||
    !currentPassword ||
    currentPassword.length > 1024 ||
    newPassword.length < 12 ||
    newPassword.length > 72 ||
    newPassword !== confirmPassword
  ) {
    return {
      success: false,
      error: "Check your passwords. The new password must be 12-72 characters and match its confirmation.",
    };
  }

  try {
    const admin = await requireAdmin();

    if (!admin) {
      return {
        success: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    const validCurrentPassword = await compare(
      currentPassword,
      admin.passwordHash,
    );

    if (!validCurrentPassword) {
      return {
        success: false,
        error: "The current password is incorrect.",
      };
    }

    const passwordHash = await hash(newPassword, 12);
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
          purpose: RESET_PURPOSE,
          usedAt: null,
        },
        data: { usedAt: now },
      });
    });

    await destroyAdminSession();

    return {
      success: true,
      message: "Password changed successfully. Please log in again.",
    };
  } catch (error) {
    console.error("Change admin password failed:", error);

    return {
      success: false,
      error: "Could not change the password. Please try again.",
    };
  }
}


// --- DATABASE ACTIONS ---

export async function saveDashboardData(
  config: any,
  rooms: any[],
  activities: any[],
) {
  if (!(await requireAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.$transaction(async (tx) => {
      // 1. Save website configuration.
      await tx.config.upsert({
        where: { id: 1 },
        update: config,
        create: { id: 1, ...config },
      });

      // 2. Save rooms and remove rooms deleted from the dashboard.
      for (const room of rooms) {
        await tx.room.upsert({
          where: { id: room.id },
          update: room,
          create: room,
        });
      }

      const roomIds = rooms.map((room) => room.id);

      await tx.room.deleteMany({
        where: {
          id: { notIn: roomIds },
        },
      });

      // 3. Save activities and remove deleted activities.
      for (const activity of activities) {
        await tx.activity.upsert({
          where: { id: activity.id },
          update: activity,
          create: activity,
        });
      }

      const activityIds = activities.map((activity) => activity.id);

      await tx.activity.deleteMany({
        where: {
          id: { notIn: activityIds },
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/activities");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to save dashboard data:", error);
    return {
      success: false,
      error: "Failed to save dashboard data.",
    };
  }
}


// --- FILE UPLOAD ACTION ---

export async function uploadImage(formData: FormData) {
  if (!(await requireAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        error: "No valid file provided.",
      };
    }

    const allowedTypes: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "image/avif": ".avif",
    };

    const extension = allowedTypes[file.type];

    if (!extension) {
      return {
        success: false,
        error: "Unsupported image format. Use JPG, PNG, WebP, GIF, or AVIF.",
      };
    }

    const MAX_SIZE = 8 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: "Image is too large. Maximum allowed size is 8MB.",
      };
    }


    const filename = `uploads/${crypto.randomUUID()}${extension}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
      storeId: process.env.BLOB_STORE_ID,
    });

    return {
      success: true,
      url: blob.url,
    };
  } catch (error) {
    console.error("Upload error:", error);

    return {
      success: false,
      error: "Image upload failed. Please try again.",
    };
  }
}
