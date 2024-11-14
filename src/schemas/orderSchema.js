import { z } from 'zod';

export const FormSchema = z.object({
    Date: z.string().min(1, "Date is required."),
    Id: z.string().min(1, "Order ID is required."),
    Type: z.coerce.bigint({
        required_error: "Order type is required.",
    }).positive("Order type must be a positive bigint."),
    Company: z.coerce.bigint({
        required_error: "Company is required.",
    }).positive("Company ID must be a positive bigint."),
    Observation: z.string().optional(),
    Price: z.coerce.number({
        required_error: "Price is required.",
    }).nonnegative("Price must be a non-negative number."),
});

export const orderSchema = z.object({
    Date: z.date({
        required_error: "Date is required.",
    }),
    Id: z.string().min(1, "Order ID is required."),
    Type: z.coerce.bigint({
        required_error: "Order type is required.",
    }).positive("Order type must be a positive bigint."),
    Company: z.coerce.bigint({
        required_error: "Company is required.",
    }).positive("Company ID must be a positive bigint."),
    Observation: z.string().optional(),
    Price: z.coerce.number({
        required_error: "Price is required.",
    }).nonnegative("Price must be a non-negative number."),
});

export const orderTypeSchema = z.object({
    Id: z.bigint().positive(),
    Name: z.string().min(1, "Order type name cannot be empty.")
});