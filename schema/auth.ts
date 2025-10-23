
import * as z from "zod";

export const nameSchema = z.object({
    name: z.string().min(1, "최소 한 글자를 입력해주세요.").max(10, "10자 이하로 입력해주세요.")
})