
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";

const MAX_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      request,
      body,

      onBeforeGenerateToken: async (pathname) => {
        if (!(await requireAdmin())) {
          throw new Error("Unauthorized");
        }

        const extension = pathname.split(".").pop()?.toLowerCase();
        const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

        if (!extension || !allowedExtensions.includes(extension)) {
          throw new Error("Unsupported image extension");
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Image upload authorization failed:", error);

    return NextResponse.json(
      { error: "Image upload failed or was not authorized." },
      { status: 400 },
    );
  }
}
