'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import OrdersForm from "@/components/order/OrdersForm" // Asegúrate de tener la ruta correcta
import { createOrder } from "@/redux/slices/orderSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";

export function CreateOrderDialog() {

    const [open, setOpen] = useState(false);

    const dispatch = useAppDispatch();

    const handleFormSubmit = (data) => {
        // Convertir Type y Company a BigInt
        const formattedData = {
            ...data,
            Type: BigInt(data.Type),
            Company: BigInt(data.Company),
        };
        dispatch(createOrder(formattedData));
        setOpen(false);
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create New Order</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new order and click submit.
                    </DialogDescription>
                </DialogHeader>
                <OrdersForm onSubmit={handleFormSubmit} />
            </DialogContent>
        </Dialog>
    );
}
