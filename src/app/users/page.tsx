"use client";

import { useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api, {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/lib/service/api";
import { useRegisterMutation } from "@/lib/service/authApi";
import { UserForm } from "@/components/user-form";
import { DeleteUser } from "@/components/deleteUser";
import { useDispatch } from "react-redux";
import useAuth from "@/hooks/auth";

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  role: "customer" | "admin";
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  useAuth();
  const dispatch = useDispatch();
  const { data: users, isLoading, error } = useGetUsersQuery({});
  const [register] = useRegisterMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddUser = async (formData: FormData) => {
    try {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const result = await register(formData).unwrap();
      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi");
      dispatch(api.util.resetApiState());
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Failed to create user:", err);
      toast.error(
        `Xatolik yuz berdi: ${
          err.data?.message || err.message || "Noma'lum xato"
        }`
      );
    }
  };

  const handleEditUser = async (formData: FormData) => {
    if (!selectedUser) return;

    try {
      console.log("Updating user:", selectedUser.id);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await toast.promise(
        updateUser({
          id: selectedUser.id,
          formData,
        }).unwrap(),
        {
          loading: "Foydalanuvchi tahrirlanmoqda...",
          success: "Foydalanuvchi muvaffaqiyatli tahrirlandi",
          error: (err) => {
            console.error("Update error:", err);
            return (
              "Tahrirlashda xatolik yuz berdi: " +
              (err.data?.message || "Noma'lum xato")
            );
          },
        }
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await toast.promise(deleteUser(selectedUser.id).unwrap(), {
        loading: "O'chirilmoqda...",
        success: () => {
          dispatch(api.util.resetApiState());
          return "Foydalanuvchi o'chirildi";
        },
        error: (err) => {
          console.error("Delete error:", err);
          return (
            "O'chirishda xatolik yuz berdi: " +
            (err.data?.message || "Noma'lum xato")
          );
        },
      });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  if (isLoading)
    return <div className="flex justify-center pt-12">Yuklanmoqda...</div>;
  if (error)
    return (
      <div className="flex justify-center pt-12 text-destructive">
        Xatolik yuz berdi
      </div>
    );

  return (
    <div className="p-4 space-y-4 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Foydalanuvchilar</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Yangi foydalanuvchi
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rasm</TableHead>
              <TableHead>Ism</TableHead>
              <TableHead>Familiya</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length ? (
              users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.photo} />
                      <AvatarFallback>
                        {user.first_name.charAt(0)}
                        {user.second_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.second_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteModalOpen(true);
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
                <TableCell colSpan={6} className="text-center">
                  <div className="py-6">
                    <p className="text-lg font-medium">Ma'lumot yo'q</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hozircha hech qanday foydalanuvchi qo'shilmagan
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yangi foydalanuvchi qo'shish</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleAddUser} submitLabel="Qo'shish" />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              initialData={{
                first_name: selectedUser.first_name,
                second_name: selectedUser.second_name,
                email: selectedUser.email,
                role: selectedUser.role,
              }}
              onSubmit={handleEditUser}
              submitLabel="Saqlash"
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteUser
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteUser}
        userName={`${selectedUser?.first_name} ${selectedUser?.second_name}`}
      />
    </div>
  );
}
