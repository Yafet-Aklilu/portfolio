/** Vercel serverless request body limit is ~4.5MB; stay under that. */
export const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;

/**
 * Resize/compress an image in the browser so admin uploads fit Vercel's body limit.
 */
export async function compressImageForUpload(
  file: File,
  maxBytes = MAX_UPLOAD_BYTES,
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= maxBytes) return file;

  const original = await createImageBitmap(file);
  let width = original.width;
  let height = original.height;
  const maxEdge = 1920;

  if (width > maxEdge || height > maxEdge) {
    const scale = maxEdge / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    original.close();
    return file;
  }

  let quality = 0.82;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(original, 0, 0, width, height);

    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );

    if (blob && blob.size <= maxBytes) break;

    if (quality > 0.45) {
      quality -= 0.1;
    } else {
      width = Math.max(640, Math.round(width * 0.8));
      height = Math.max(640, Math.round(height * 0.8));
      quality = 0.75;
    }
  }

  original.close();

  if (!blob || blob.size > maxBytes) {
    throw new Error(
      "Image is still too large after compression (max ~3.5MB). Use a smaller file or paste a URL.",
    );
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export async function readUploadError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const data = JSON.parse(text) as { error?: string };
    if (data.error) return data.error;
  } catch {
    // Platform / proxy plain-text errors (e.g. Request Entity Too Large)
  }
  if (/request entity too large/i.test(text)) {
    return "Image is too large for upload (max ~4MB on Vercel). Try a smaller file or paste a URL.";
  }
  if (text.trim()) return text.trim().slice(0, 200);
  return `Upload failed (${response.status})`;
}
