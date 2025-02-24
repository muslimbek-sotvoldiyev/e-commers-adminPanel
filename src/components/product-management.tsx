"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/lib/service/productcrud";
import { Button } from "@/components/ui/button";
import { DeleteProductDialog } from "./DeleteProductModal";
import { EditProductDialog } from "./editProductModal";

const parseArray = (value: string | null | undefined): string[] =>
  value ? (Array.isArray(JSON.parse(value)) ? JSON.parse(value) : []) : [];

export function ProductManagement() {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await toast.promise(deleteProduct(selectedProduct.id).unwrap(), {
        loading: "O'chirilmoqda...",
        success: "Mahsulot muvaffaqiyatli o'chirildi",
        error: "Mahsulotni o'chirishda xatolik yuz berdi",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  if (isLoading)
    return <div className="flex justify-center pt-12">Yuklanmoqda...</div>;
  if (isError)
    return (
      <div className="flex justify-center pt-12 text-red-700">
        Xatolik yuz berdi
      </div>
    );

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
                  <th className="p-3 text-left text-sm font-semibold">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3 text-sm">{product.id}</td>
                    <td className="p-3">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="p-3 text-sm">{product.name}</td>
                    <td className="p-3 text-sm">{product.price}</td>
                    <td className="p-3 text-sm">{product.category?.name}</td>
                    <td className="p-3 text-sm">
                      {parseArray(product.colors).join(", ") || "N/A"}
                    </td>
                    <td className="p-3 text-sm">
                      {parseArray(product.sizes).join(", ") || "N/A"}
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        productName={selectedProduct?.name || ""}
      />

      {selectedProduct && (
        <EditProductDialog
          refetch={refetch}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
