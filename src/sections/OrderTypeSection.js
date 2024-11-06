import { useAppSelector } from "@/redux/hooks";
import { selectOrderTypesData } from "@/redux/reducers/orderTypeSlice";
import OrterTypesContent from "@/utils/OrterTypesContent";

export default function OrderTypeSection() {
    const { orderTypes, loading: loadingOrderTypes, error: errorOrderTypes } = useAppSelector(selectOrderTypesData);
    return (
        <OrterTypesContent orderTypes={orderTypes} loading={loadingOrderTypes} error={errorOrderTypes} />
    )
}
