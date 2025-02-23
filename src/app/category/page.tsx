"use client";
import React, { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  createdAt?: string;
}

const CategoryManagement: React.FC = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Avtomobil",
      createdAt: "2024-02-18",
    },
    {
      id: "2",
      name: "Elektronika",
      createdAt: "2024-02-18",
    },
  ]);

  const handleEdit = (category: Category) => {
    toast.warning("Tahrirlash funksiyasi hali ishlamaydi");
  };

  const handleDelete = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );

      return true; 
    } catch (error) {
      console.error("Error deleting category:", error);
      return false; 
    }
  };

  const handleDeleteClick = (item: Category) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
    toast.warning("O'chirish funksiyasi hali ishlamaydi");
  };

  const handleEditClick = (category: Category) => {
    handleEdit(category);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete?.id) {
      try {
        setDeleteModalOpen(false);
        const success = await handleDelete(itemToDelete.id);
        if (success) {
          toast.success(`${itemToDelete.name} o'chirildi`);
        } else {
          toast.error("Qayta urinib ko'ring, xatolik yuz berdi");
        }
      } catch (error) {
        setDeleteModalOpen(false);
        toast.error("Qayta urinib ko'ring, xatolik yuz berdi");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  const handleAddClick = () => {
    toast.warning("Qo'shish funksiyasi hali ishlamaydi");
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Category Boshqaruvi</h2>
        <Button
          className="px-6 py-4 rounded-lg shadow-md transition"
          onClick={handleAddClick}
        >
          Qo'shish
        </Button>
      </div>

      <Toaster position="top-right" />

      <div className="rounded-lg shadow-sm overflow-hidden mt-4">
        <div className="overflow-x-auto">
          {categories.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-semibold">ID</th>
                  <th className="p-3 text-left text-sm font-semibold">Nomi</th>
                  <th className="p-3 text-left text-sm font-semibold">Sana</th>
                  <th className="w-20 p-3 text-center text-sm font-semibold">
                    Harakatlar
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b transition-colors hover:bg-gray-800"
                  >
                    <td className="p-3 text-sm">{category.id}</td>
                    <td className="p-3 text-sm font-medium">{category.name}</td>
                    <td className="p-3 text-sm">
                      {category.createdAt ?? "Sana mavjud emas"}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-1.5 hover:bg-blue-200 rounded-md hover:text-blue-600 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="p-1.5 hover:bg-red-200 rounded-md hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
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
                Hozircha hech qanday kategoriya qo'shilmagan
              </p>
            </div>
          )}
        </div>
      </div>

      {/* O'chirish modali */}
      {deleteModalOpen && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">O'chirish</h3>
              <button
                onClick={handleDeleteCancel}
                className="p-1.5 hover:bg-gray-100 rounded-md hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm">
              {itemToDelete?.name} kategoriyasini o'chirmoqchimisiz?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-1.5 text-sm hover:bg-gray-100 rounded-md transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 bg-red-600 text-white text-sm hover:bg-red-700 rounded-md transition-colors"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
