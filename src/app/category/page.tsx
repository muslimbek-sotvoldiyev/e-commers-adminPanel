"use client";

import { useState } from "react";
import { Pencil, Trash2, FolderPlus } from "lucide-react";
import { toast } from "sonner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuth from "@/hooks/auth";

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryManagement() {
  useAuth();
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
      await toast.promise(
        updateCategory({ id: category.id, name: category.name }).unwrap(),
        {
          loading: "Tahrirlanmoqda...",
          success: `${category.name} tahrirlandi`,
          error: "Tahrirlashda xatolik yuz berdi",
        }
      );
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await toast.promise(deleteCategory(id).unwrap(), {
        loading: "O'chirilmoqda...",
        success: "Kategoriya o'chirildi",
        error: "O'chirishda xatolik yuz berdi",
      });
      setDeleteModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await toast.promise(createCategory({ name: newCategoryName }).unwrap(), {
        loading: "Qo'shilmoqda...",
        success: "Yangi kategoriya qo'shildi",
        error: "Qo'shishda xatolik yuz berdi",
      });
      setAddModalOpen(false);
      setNewCategoryName("");
      refetch();
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  if (isLoading)
    return <div className="flex justify-center pt-12">Yuklanmoqda...</div>;
  if (isError)
    return (
      <div className="flex justify-center pt-12 text-destructive">
        Xatolik yuz berdi
      </div>
    );

  return (
    <div className="p-4 space-y-4 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Kategoriyalar</h2>
        <Button onClick={() => setAddModalOpen(true)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Yangi kategoriya
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nomi</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.length ? (
              categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setItemToEdit(category);
                          setEditModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          setItemToDelete(category);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <div className="py-6">
                    <p className="text-lg font-medium">Ma'lumot yo'q</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hozircha hech qanday kategoriya qo'shilmagan
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
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

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nomi</Label>
              <Input
                id="name"
                value={itemToEdit?.name || ""}
                onChange={(e) =>
                  setItemToEdit((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
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

      {/* Add Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi kategoriya qo'shish</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newName">Nomi</Label>
              <Input
                id="newName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
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
}
