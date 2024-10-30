'use client'

import Table from "@/components/Table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getOrders } from "@/redux/reducers/orderSlice";
import { useEffect } from "react";

export default function Home() {
  const orders = useAppSelector((state) => state.order)
  const dispatch = useAppDispatch();

  console.log(orders)
  useEffect(() => {
    dispatch(getOrders(dispatch))
  }, [dispatch]);

  return (
    <main className="flex flex-col p-10 ">
      <Table titles={orders.orders.title} data={orders.orders.data} />
    </main>
  );
}
