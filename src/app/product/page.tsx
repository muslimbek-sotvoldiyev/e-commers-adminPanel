"use client";

import { AddProductDialog } from "@/components/addProductModal";
import { ProductManagement } from "@/components/Productmap";
import useAuth from "@/hooks/auth";

export default function ProductsPage() {
  useAuth();
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mahsulotlar</h1>
        <AddProductDialog />
      </div>
      <ProductManagement />
    </div>
  );
}
