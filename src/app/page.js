'use client';

import { useAppDispatch } from "@/redux/hooks";
import { getCompanies } from "@/redux/reducers/companySlice";
import { getOrders } from "@/redux/reducers/orderSlice";
import { useEffect } from "react";
import CompanyInfo from "@/utils/CompanyInfo";
import OrderSection from "@/sections/OrderSection";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(getOrders()), dispatch(getCompanies())]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <main className="flex flex-col p-6 sm:p-10">
      <OrderSection />
      <CompanyInfo />
    </main>
  );
}
