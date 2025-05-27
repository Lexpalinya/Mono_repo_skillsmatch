const CLOUD_NAME = "dq3d5qshp";
const UPLOAD_PRESET = "skillmatch";

/**
 * Upload image to Cloudinary using unsigned preset
 * @param file - File object (from input type="file")
 * @returns {Promise<string>} - URL of the uploaded image
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(url, {
    method: "POST",
    body: formData as any,
  });

  if (!response.ok) {
    throw new Error("Upload failed: " + response.statusText);
  }

  const data: any = await response.json();
  return data.secure_url;
}
