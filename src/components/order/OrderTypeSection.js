import { useAppSelector } from "@/redux/hooks";
import { selectOrderTypesData } from "@/redux/slices/orderTypeSlice";
import OrterTypesContent from "@/components/order/OrderTypesContent";

export default function OrderTypeSection() {
    const { orderTypes, loading: loadingOrderTypes, error: errorOrderTypes } = useAppSelector(selectOrderTypesData);
    return (
        <OrterTypesContent orderTypes={orderTypes} loading={loadingOrderTypes} error={errorOrderTypes} />
    )
}
