'use client'

import Loader from "@/components/Loader";
import Table from "@/components/OrdersTable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCompany } from "@/redux/reducers/companySlice";
import { getOrders } from "@/redux/reducers/orderSlice";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const company = useAppSelector((state) => state.company);

  useEffect(() => {
    dispatch(getOrders());
    dispatch(getCompany());
  }, [dispatch]);

  return (
    <main className="flex flex-col p-10">
      {orders?.data && orders?.title ? (
        <Table titles={orders.title} data={orders.data} />
      ) : (
        <Loader/>
      )}
    </main>
  );
}
