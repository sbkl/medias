"use server";

import { zid } from "convex-helpers/server/zod";
import { z } from "zod";

async function getUploadUrl() {
  try {
    if (!process.env.MEDIA_APP_ID || !process.env.MEDIA_API_KEY) {
      throw new Error("Missing required environment variables");
    }

    const response = z
      .object({
        uploadUrl: z.string(),
      })
      .safeParse(
        await fetch(`${process.env.CONVEX_URL}/upload-url`, {
          method: "POST",
          headers: {
            "X-Api-Key-Id": process.env.MEDIA_APP_ID,
            Authorization: `Bearer ${process.env.MEDIA_API_KEY}`,
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())
      );

    if (response.error) {
      throw new Error("Failed to get upload URL");
    }

    return response.data;
  } catch (error) {
    console.error("Error getting upload URL:", error);
    throw error;
  }
}

export const uploadFile = async (file: File | Blob) => {
  try {
    // Step 1: Get the upload URL
    const { uploadUrl } = await getUploadUrl();

    // Step 3: Upload the file
    const response = z
      .object({
        storageId: zid("_storage"),
      })
      .safeParse(
        await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        }).then((res) => res.json())
      );

    if (response.error) {
      throw new Error("Failed to upload file");
    }

    return response.data.storageId;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
