'use client';

import { useAppDispatch } from "@/redux/hooks";
import { getCompanies } from "@/redux/slices/companySlice";
import { getOrderCountsByMonth, getOrders } from "@/redux/slices/orderSlice";
import { useEffect } from "react";
import OrderSection from "@/components/order/OrderSection";
import { getOrderTypes } from "@/redux/slices/orderTypeSlice";
import CompanySection from "@/components/company/CompanySection";
import OrderTypeSection from "@/components/order/OrderTypeSection";

export default function Orders() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(getOrders()), dispatch(getCompanies()), dispatch(getOrderTypes()), dispatch(getOrderCountsByMonth({ startDate: "2024/10/1", endDate: "2024/10/31" }))]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <main className="flex flex-col p-6 sm:p-10">
      <OrderSection />
      <CompanySection />
      <OrderTypeSection/>
    </main>
  );
}
