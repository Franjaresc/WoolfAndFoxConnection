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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils/utils"
import { selectCompanyData } from "@/redux/slices/companySlice"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { useAppSelector } from "@/redux/hooks"
import { selectOrderTypesData } from "@/redux/slices/orderTypeSlice"


const FormSchema = z.object({
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

export default function OrdersForm({ onSubmit }) {
    const { company } = useAppSelector(selectCompanyData);
    const { orderTypes } = useAppSelector(selectOrderTypesData);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            Date: "",
            Id: "",
            Type: BigInt(0),
            Company: BigInt(0),
            Observation: "",
            Price: 0.0,
        },
    });


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="Date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of order</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    The date of placing the order
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Id"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
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
                            <FormItem className="flex flex-col">
                                <FormLabel>Type</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? orderTypes.find(
                                                        (com) => com.Id === field.value
                                                    )?.Name
                                                    : "Select order type"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className=" p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search order type..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                    {orderTypes.map((orderType) => (
                                                        <CommandItem
                                                            value={orderType.Name}
                                                            key={orderType.Id}
                                                            onSelect={() => {
                                                                form.setValue("Type", orderType.Id)
                                                            }}
                                                        >
                                                            {orderType.Name}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    orderType.Id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    The order type.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Company"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Company</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? company.find(
                                                        (com) => com.Id === field.value
                                                    )?.Name
                                                    : "Select company"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className=" p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search company..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                    {company.map((company) => (
                                                        <CommandItem
                                                            value={company.Name}
                                                            key={company.Id}
                                                            onSelect={() => {
                                                                form.setValue("Company", company.Id)
                                                            }}
                                                        >
                                                            {company.Name}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    company.Id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    The company that send the order.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Observation"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Observation (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter observation" {...field} />
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
                            <FormItem className="flex flex-col">
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
