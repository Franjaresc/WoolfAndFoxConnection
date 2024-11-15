"use client"
import { useEffect, useState } from "react"
import { format, subDays } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "../global/DatePickerWithRange"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectCompanyData } from "@/redux/slices/companySlice"
import { cn } from "@/lib/utils/utils"
import { generateInvoiceCSV, selectCSVData } from "@/redux/slices/csvSlice"

const FormSchema = z.object({
    company: z.string().min(1, { message: "Company is required" }),
    dateRange: z.object({
        from: z.date().nullable(),
        to: z.date().nullable(),
    }).refine(data => data.from && data.to, {
        message: "Both start and end dates are required",
    }),
})

export function InvoiceOrdersForm() {

    const dispatch = useAppDispatch();

    const { status, message, error, csvContent } = useAppSelector(selectCSVData);

    const { company } = useAppSelector(selectCompanyData);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            company: BigInt(0),
            dateRange: {
                from: subDays(new Date(), 20),
                to: new Date(),
            }
        },
    })

    useEffect(() => {
        if (csvContent) {
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'invoice.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
    }, [csvContent]);

    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 20),
        to: new Date(),
    })

    function onSubmit(data) {
        dispatch(generateInvoiceCSV({
            company: data.company,
            startDate: format(data.dateRange.from, 'yyyy/MM/dd'),
            endDate: format(data.dateRange.to, 'yyyy/MM/dd'),
        }));
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="company"
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
                                                            form.setValue("company", company.Id)
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
                                The company that will receive the invoice.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date Range</FormLabel>
                            <Controller
                                control={form.control}
                                name="dateRange"
                                render={({ field }) => (
                                    <DatePickerWithRange
                                        date={dateRange}
                                        setDate={(range) => {
                                            setDateRange(range)
                                            field.onChange(range)
                                            form.setValue("dateRange", range)
                                        }}
                                    />
                                )}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Generate Invoice</Button>
                {status === 'loading' && <p>Generating CSV...</p>}
                {status === 'succeeded' && <p>{message}</p>}
                {status === 'failed' && <p>Error: {error}</p>}
            </form>
        </Form>
    )
}