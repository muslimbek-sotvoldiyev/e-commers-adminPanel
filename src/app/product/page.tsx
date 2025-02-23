"use client";

import type React from "react";
import { useGetProductsQuery } from "@/lib/service/api";

// Helper function to parse JSON strings or return empty array
const parseArray = (value: string | null | undefined): string[] =>
  value ? (Array.isArray(JSON.parse(value)) ? JSON.parse(value) : []) : [];

// Main Component
const ProductManagement: React.FC = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery({});

  if (isLoading) return <div className="flex justify-center pt-12">Yuklanmoqda...</div>;
  if (isError) return <div className="flex justify-center pt-12 text-red-700">Xatolik yuz berdi</div>;

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Mahsulotlar</h2>
      <div className="rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {products?.length ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-semibold">ID</th>
                  <th className="p-3 text-left text-sm font-semibold">Rasm</th>
                  <th className="p-3 text-left text-sm font-semibold">Nomi</th>
                  <th className="p-3 text-left text-sm font-semibold">Narxi</th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Kategoriya
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Ranglar
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">
                    O'lchamlar
                  </th>
                  <th className="p-3 text-left text-sm font-semibold">Sana</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3 text-sm">{product.id}</td>
                    <td className="p-3">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="p-3 text-sm">{product.name}</td>
                    <td className="p-3 text-sm">{product.price}</td>
                    <td className="p-3 text-sm">{product.category}</td>
                    <td className="p-3 text-sm">
                      {parseArray(product.colors).join(", ") || "N/A"}
                    </td>
                    <td className="p-3 text-sm">
                      {parseArray(product.sizes).join(", ") || "N/A"}
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <p className="text-lg font-medium">Ma'lumot yo'q</p>
              <p className="text-sm text-gray-500 mt-1">
                Hozircha hech qanday mahsulot qo'shilmagan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
