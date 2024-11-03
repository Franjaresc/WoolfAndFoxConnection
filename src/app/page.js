'use client';

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCompany, selectCompanyData } from "@/redux/reducers/companySlice";
import { getOrders, selectOrdersData } from "@/redux/reducers/orderSlice";
import { useEffect } from "react";
import CompanyInfo from "@/utils/CompanyInfo";
import OrderSection from "@/sections/OrderSection";

export default function Home() {
  const dispatch = useAppDispatch();

  const { company, loading: loadingCompany, error: errorCompany } = useAppSelector(selectCompanyData);

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

  return (
    <main className="flex flex-col p-6 sm:p-10">
      <OrderSection/>
      <CompanyInfo company={company} loading={loadingCompany} error={errorCompany} />
    </main>
  );
}
