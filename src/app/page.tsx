"use client";
import SalesDashboard from "@/components/DashboadChart";
import useAuth from "@/hooks/auth";

export default function Home() {
  useAuth();
  return (
    <div>
      <SalesDashboard />
    </div>
  );
}
