import Loader from "@/components/loader/Loader";
import OrdersTable from "@/components/order/OrdersTable";
import ErrorMessage from "@/components/error/ErrorMessage";

const OrdersContent = ({ orders, loading, error }) => {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={`There was an error loading the orders. Please try again later. ${error}`} />;
  if (!orders.length) return <ErrorMessage message="No orders found." />;

  return <OrdersTable data={orders} />;
};

export default OrdersContent;
