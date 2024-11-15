import { z } from "zod";

export const companySchema = z.object({
    Id: z.number().int().positive().or(z.string()).refine(val => typeof val === 'number' || /^\d+$/.test(val), {
        message: "Company ID must be a positive integer."
    }),
    Name: z.string().min(1, { message: "Company name cannot be empty." })
});