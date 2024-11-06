'use client';

import { useAppDispatch } from "@/redux/hooks";
import { getCompanies } from "@/redux/reducers/companySlice";
import { getOrders } from "@/redux/reducers/orderSlice";
import { useEffect } from "react";
import OrderSection from "@/sections/OrderSection";
import { getOrderTypes } from "@/redux/reducers/orderTypeSlice";
import CompanySection from "@/sections/CompanySection";
import OrderTypeSection from "@/sections/OrderTypeSection";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(getOrders()), dispatch(getCompanies()), dispatch(getOrderTypes())]);
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
