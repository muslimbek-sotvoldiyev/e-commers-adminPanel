import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export interface UserFormData {
  first_name: string;
  second_name: string;
  email: string;
  password?: string;
  role: "customer" | "admin";
  photo: File | null;
}

const VALID_ROLES = ["customer", "admin"] as const;
type Role = (typeof VALID_ROLES)[number];

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export function UserForm({
  initialData,
  onSubmit,
  submitLabel,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    first_name: initialData?.first_name || "",
    second_name: initialData?.second_name || "",
    email: initialData?.email || "",
    password: "",
    role: (initialData?.role as Role) || "customer",
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();

    submitData.append("first_name", formData.first_name);
    submitData.append("second_name", formData.second_name);
    submitData.append("email", formData.email);
    submitData.append("role", formData.role);

    if (formData.password) {
      submitData.append("password", formData.password);
    }

    if (formData.photo) {
      submitData.append("photo", formData.photo);
    }

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center mb-6">
        <div className="space-y-2">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={
                previewUrl ||
                (typeof initialData?.photo === "string"
                  ? initialData.photo
                  : undefined)
              }
            />
            <AvatarFallback>
              {formData.first_name.charAt(0)}
              {formData.second_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="max-w-[250px]"
          />
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first_name">Ism</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="second_name">Familiya</Label>
          <Input
            id="second_name"
            value={formData.second_name}
            onChange={(e) =>
              setFormData((prev) => ({
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
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
          />
        </div>

        {!initialData && (
          <div className="grid gap-2">
            <Label htmlFor="password">Parol</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required={!initialData}
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value: Role) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Roleni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Mijoz</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
