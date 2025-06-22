import { z } from "zod";

export const ECurrencyEnum = z.enum(["KIP", "THB", "USD"], {
    errorMap: () => ({ message: "ສະກຸນເງິນບໍ່ຖືກຕ້ອງ" }),
});

export const JobberProfileCreateDto = z.object({
    jId: z.string({ message: "ລະຫັດຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ" }).uuid({ message: "ລະຫັດຜູ້ໃຊ້ຕ້ອງເປັນ UUID" }),
    elId: z.string({ message: "ລະຫັດລະດັບການສຶກສາບໍ່ຖືກຕ້ອງ" }).uuid(),
    eiId: z.string({ message: "ລະຫັດສະຖາບັນການສຶກສາບໍ່ຖືກຕ້ອງ" }).uuid(),
    mId: z.string({ message: "ລະຫັດສາຂາວິຊາບໍ່ຖືກຕ້ອງ" }).uuid(),
    cId: z.string({ message: "ລະຫັດວິຊາບໍ່ຖືກຕ້ອງ" }).uuid(),

    gpa: z
        .number({ message: "ກະລຸນາປ້ອນ GPA" })
        .min(0, { message: "GPA ຕ່ຳທີ່ສຸດແມ່ນ 0" })
        .max(4, { message: "GPA ສູງສຸດແມ່ນ 4" }),

    drivingCardType: z.string({ message: "ປ້ອນປະເພດໃບຂັບຂີ່" }).optional().nullable(),

    more: z.string({ message: "ກະລຸນາປ້ອນຂໍ້ມູນເພີ່ມເຕີມ" }).min(1, { message: "ຂໍ້ມູນເພີ່ມເຕີມຕ້ອງບໍ່ວ່າງເປົ່າ" }),

    startSalary: z.number({ message: "ກະລຸນາປ້ອນເງິນເດືອນ" }).optional().nullable(),

    currency: ECurrencyEnum.default("KIP"),

    workDay: z
        .array(z.string().min(1, { message: "ມື້ເຮັດວຽກຕ້ອງບໍ່ວ່າງ" }))
        .nonempty({ message: "ກະລຸນາເລືອກມື້ເຮັດວຽກ" }),

    checkInTime: z.coerce.date({ message: "ເວລາເຂົ້າວຽກບໍ່ຖືກຕ້ອງ" }).optional().nullable(),

    checkOutTime: z.coerce.date({ message: "ເວລາເລີກວຽກບໍ່ຖືກຕ້ອງ" }).optional().nullable(),
});


export const JobberProfileUpdateDto = JobberProfileCreateDto.partial()
export type IJobberProfileCreateDtoType = z.infer<typeof JobberProfileCreateDto>
export type IJobberProfileUpdateDtoType = z.infer<typeof JobberProfileUpdateDto>