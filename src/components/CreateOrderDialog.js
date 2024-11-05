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
import OrdersForm from "@/components/OrdersForm" // Asegúrate de tener la ruta correcta
import { createOrder } from "@/redux/reducers/orderSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";

export function CreateOrderDialog() {

    const [open, setOpen] = useState(false);

    const dispatch = useAppDispatch();

    const handleFormSubmit = (data) => {
        dispatch(createOrder(data))
        setOpen(false)
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
