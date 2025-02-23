"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery, useDeleteUserMutation } from "@/lib/service/api";
import { useRegisterMutation } from "@/lib/service/authApi";

export default function UsersPage() {
  const { data: users, isLoading, error, refetch} = useGetUsersQuery([]);
  const [Register] = useRegisterMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    first_name: "",
    second_name: "",
    email: "",
    password: "",
    role: "user",
    photo: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewUserData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", newUserData.first_name);
      formData.append("second_name", newUserData.second_name);
      formData.append("email", newUserData.email);
      formData.append("password", newUserData.password);
      formData.append("role", newUserData.role);

      if (newUserData.photo) {
        formData.append("photo", newUserData.photo);
      }

      await Register(formData).unwrap();
      setIsAddModalOpen(false);
      setNewUserData({
        first_name: "",
        second_name: "",
        email: "",
        password: "",
        role: "user",
        photo: null,
      });
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error loading users</div>;

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-4 bg-green-600 hover:bg-green-700"
      >
        Add New User
      </Button>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={newUserData.first_name}
                  onChange={(e) =>
                    setNewUserData((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="second_name">Second Name</Label>
                <Input
                  id="second_name"
                  value={newUserData.second_name}
                  onChange={(e) =>
                    setNewUserData((prev) => ({
                      ...prev,
                      second_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Second Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.second_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
