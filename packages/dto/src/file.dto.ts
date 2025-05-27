import { z } from "zod";

export const fileSchema = z
  .custom<File>()
  .refine((file) => file instanceof File, { message: "Invalid file" })
  .refine((file) => file.size < 5 * 1024 * 1024, {
    message: "File must be < 5MB",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    {
      message: "Invalid file type",
    }
  );
