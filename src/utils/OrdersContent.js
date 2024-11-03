import Loader from "@/components/Loader";
import OrdersTable from "@/components/OrdersTable";
import ErrorMessage from "@/utils/ErrorMessage";

const OrdersContent = ({ orders, loading, error }) => {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={`There was an error loading the orders. Please try again later. ${error}`} />;
  if (!orders.length) return <ErrorMessage message="No orders found." />;

  return <OrdersTable data={orders} />;
};

export default OrdersContent;
