'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import OrdersForm from "@/components/OrdersForm" // Asegúrate de tener la ruta correcta

export function CreateOrderDialog() {
    const handleFormSubmit = (data) => {
        console.log("Form data submitted:", data);
        // Aquí puedes manejar la lógica para guardar la orden o cerrar el diálogo
    };

    return (
        <Dialog>
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
