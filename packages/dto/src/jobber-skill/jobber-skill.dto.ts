import { z } from "zod";

export const JobberSkillCreateDto = z.object({
    jId: z.string().min(1, { message: "ລະຫັດຜູ້ສະໝັກບໍ່ຄວນເປົ່າ" }),
    sIds: z.array(z.string().min(1)).nonempty({ message: "ກະລຸນາເລືອກທັກສະ" }),
});

export type IJobberSkillDtoCreateType = z.infer<typeof JobberSkillCreateDto>;

export const JobberSkillDeleteDto = z.object({
    jId: z.string().min(1, { message: "ລະຫັດຜູ້ສະໝັກບໍ່ຄວນເປົ່າ" }),
    sId: z.string().min(1, { message: "ລະຫັດທັກສະບໍ່ຄວນເປົ່າ" }),
});

export type IJobberSkillDeleteDtoType = z.infer<typeof JobberSkillDeleteDto>;
