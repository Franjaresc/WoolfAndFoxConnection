'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    Date: z.string().min(2, {
        message: "Date cannot be empty.",
    }),
    Id: z.string().min(2, {
        message: "ID must be at least 2 characters.",
    }),
    Type: z.number({
        required_error: "Type is required.",
    }).nonnegative(),
    Company: z.number({
        required_error: "Company is required.",
    }).nonnegative(),
    Observation: z.string().optional(),
    Price: z.number({
        required_error: "Price is required.",
    }).nonnegative(),
})

export default function OrdersForm() {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            Date: "",
            Id: "",
            Type: 0,
            Company: 0,
            Observation: "",
            Price: 0.0,
        },
    })

    function onSubmit(data) {
        console.log("Form data submitted:", data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="Date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter date" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Please provide a date for the order.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Order ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter order ID" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Unique identifier for the order.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter type" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Specify the order type as a number.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter company ID" {...field} />
                                </FormControl>
                                <FormDescription>
                                    ID of the company associated with this order.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Observation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observation (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter observation (if any)" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Add any additional details (optional).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter price" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Specify the price for the order.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <Button variant="default" type="submit">Submit Order</Button>
                </div>
            </form>
        </Form>
    )
}
