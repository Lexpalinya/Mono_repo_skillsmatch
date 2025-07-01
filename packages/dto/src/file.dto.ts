import { z } from "zod";

export const fileSchema = z
  .custom<File>()
  .refine((file) => file instanceof File, { message: "ບໍ່ພົບໄຟສທີ່ບໍ່ຕ້ອງ" })
  .refine((file) => file.size < 20 * 1024 * 1024, {
    message: "ຂະໜາດຕ້ອງນ້ອຍກ່ວາ 20MB",
  })

