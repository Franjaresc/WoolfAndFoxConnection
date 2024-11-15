import { CreateOrderDialog } from '@/components/order/CreateOrderDialog'
import { useAppSelector } from '@/redux/hooks';
import { selectOrdersData } from '@/redux/slices/orderSlice';
import OrdersContent from '@/components/order/OrdersContent'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from 'react-day-picker'
import { OrdersChart } from './OrdersChart';
import { InvoiceOrdersForm } from './InvoiceOrdersForm';

export default function OrderSection() {
    const { orders, loading: loadingOrders, error: errorOrders, orderCountsByMonth } = useAppSelector(selectOrdersData);
    return (
        <section>
            <CreateOrderDialog>
                <Button variant="outline" className="m-auto">
                    New Order <PlusCircledIcon className="ml-2 h-4 w-4" />
                </Button>
            </CreateOrderDialog>
            <OrdersContent orders={orders} loading={loadingOrders} error={errorOrders} />
            <OrdersChart data={orderCountsByMonth} />
            <InvoiceOrdersForm />
        </section>
    )
}
