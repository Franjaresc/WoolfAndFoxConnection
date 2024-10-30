'use client'

import Loader from "@/components/Loader";
import OrdersTable from "@/components/OrdersTable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCompany } from "@/redux/reducers/companySlice";
import { getOrders } from "@/redux/reducers/orderSlice";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  
  // Selección de estados
  const { orders, loading, error } = useAppSelector((state) => ({
    orders: state.order.orders,
    loading: state.order.loading,
    error: state.order.error,
  }));
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(getOrders()), dispatch(getCompany())]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  // Función para renderizar el contenido
  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div className="text-primary-600 dark:text-primary-400 text-center">
          <p>There was an error loading the orders. Please try again later.</p>
        </div>
      );
    }

    if (!orders?.data || !orders?.title) {
      return (
        <div className="text-secondary-500 dark:text-secondary-300 text-center">
          <p>No orders found.</p>
        </div>
      );
    }

    return <OrdersTable titles={orders.title} data={orders.data} />;
  };

  return (
    <main className="flex flex-col p-6 sm:p-10 bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md">
      {renderContent()}
    </main>
  );
}
