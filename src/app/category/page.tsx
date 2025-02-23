"use client";

import type React from "react";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/service/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryManagement: React.FC = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery({});
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleEdit = async (category: Category) => {
    try {
      await updateCategory({ id: category.id, name: category.name }).unwrap();
      toast.success(`${category.name} tahrirlandi`);
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success(`Kategoriya o'chirildi`);
      setDeleteModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  const handleAdd = async () => {
    try {
      await createCategory({ name: newCategoryName }).unwrap();
      toast.success(`Yangi kategoriya qo'shildi`);
      setAddModalOpen(false);
      setNewCategoryName("");
      refetch();
    } catch (error) {
      toast.error("Qo'shishda xatolik yuz berdi");
    }
  };

  const handleEditClick = (category: Category) => {
    setItemToEdit(category);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (item: Category) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  if (isLoading) return <div>Yuklanmoqda...</div>;
  if (isError) return <div>Xatolik yuz berdi</div>;

  return (
    <div className="p-4 min-h-screen">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Category Boshqaruvi</h2>
        <Button
          className="px-6 py-4 rounded-lg shadow-md transition"
          onClick={() => setAddModalOpen(true)}
        >
          Qo'shish
        </Button>
      </div>

      <Toaster position="top-right" />

      <div className="rounded-lg shadow-sm overflow-hidden mt-4">
        <div className="overflow-x-auto">
          {categories && categories.length > 0 ? (
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
                {categories.map((category: any) => (
                  <tr
                    key={category.id}
                    className="border-b transition-colors hover:bg-gray-300 dark:hover:bg-gray-800"
                  >
                    <td className="p-3 text-sm">{category.id}</td>
                    <td className="p-3 text-sm font-medium">{category.name}</td>
                    <td className="p-3 text-sm">
                      {new Date(category.createdAt).toLocaleDateString()}
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
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O'chirish</DialogTitle>
          </DialogHeader>
          <p className="mb-4 text-sm">
            {itemToDelete?.name} kategoriyasini o'chirmoqchimisiz?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={() => itemToDelete && handleDelete(itemToDelete.id)}
            >
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tahrirlash modali */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nomi
              </Label>
              <Input
                id="name"
                value={itemToEdit?.name || ""}
                onChange={(e) =>
                  setItemToEdit((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={() => itemToEdit && handleEdit(itemToEdit)}>
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Qo'shish modali */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi kategoriya qo'shish</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newName" className="text-right">
                Nomi
              </Label>
              <Input
                id="newName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleAdd}>Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
