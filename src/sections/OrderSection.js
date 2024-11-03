import { CreateOrderDialog } from '@/components/CreateOrderDialog'
import { useAppSelector } from '@/redux/hooks';
import { selectOrdersData } from '@/redux/reducers/orderSlice';
import OrdersContent from '@/utils/OrdersContent'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from 'react-day-picker'

export default function OrderSection() {
    const { orders, loading: loadingOrders, error: errorOrders } = useAppSelector(selectOrdersData);
    return (
        <section>
            <CreateOrderDialog>
                <Button variant="outline" className="m-auto">
                    New Order <PlusCircledIcon className="ml-2 h-4 w-4" />
                </Button>
            </CreateOrderDialog>
            <OrdersContent orders={orders} loading={loadingOrders} error={errorOrders} />
        </section>
    )
}
