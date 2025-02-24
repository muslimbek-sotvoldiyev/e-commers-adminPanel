"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useGetCategoriesQuery } from "@/lib/service/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import productcrudAPi, {
  useUpdateProductMutation,
} from "@/lib/service/productcrud";
import { useDispatch } from "react-redux";

const formSchema = z.object({
  name: z.string().min(2, "Nom 2 ta harfdan kam bo'lmasligi kerak"),
  price: z.string().min(1, "Narx kiritilishi shart"),
  description: z.string().min(10, "Tavsif 10 ta harfdan kam bo'lmasligi kerak"),
  category_id: z.string().min(1, "Kategoriya tanlanishi shart"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  images: z.any(),
});

const colors = ["Qora", "Oq", "Qizil", "Ko'k", "Yashil"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

export function EditProductDialog({
  open,
  onOpenChange,
  product,
}: EditProductDialogProps) {
  const dispatch = useDispatch();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const [updateProduct] = useUpdateProductMutation();
  const { data: categories } = useGetCategoriesQuery({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      category_id: "",
      colors: [],
      sizes: [],
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category_id: product.category_id.toString(),
      });

      try {
        const colors = product.colors ? JSON.parse(product.colors) : [];
        const sizes = product.sizes ? JSON.parse(product.sizes) : [];
        setSelectedColors(colors);
        setSelectedSizes(sizes);
      } catch (error) {
        console.error("Error parsing colors/sizes:", error);
      }
    }
  }, [product, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("category_id", values.category_id);

      if (selectedColors.length > 0) {
        formData.append("colors", JSON.stringify(selectedColors));
      }

      if (selectedSizes.length > 0) {
        formData.append("sizes", JSON.stringify(selectedSizes));
      }

      if (imageFiles) {
        Array.from(imageFiles).forEach((file) => {
          formData.append("images", file);
        });
      }

      toast.promise(updateProduct({ id: product.id, formData }).unwrap(), {
        loading: "Mahsulot yangilanmoqda...",
        success: () => {
          onOpenChange(false);
          dispatch(productcrudAPi.util.resetApiState());
          return "Mahsulot muvaffaqiyatli yangilandi";
        },
        error: "Mahsulot yangilashda xatolik yuz berdi",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Mahsulot yangilashda xatolik yuz berdi");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Mahsulot nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Narxi</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mahsulot haqida" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoriya</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="colors"
              render={() => (
                <FormItem>
                  <FormLabel>Ranglar (ixtiyoriy)</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedColors.includes(color)}
                          onCheckedChange={() => {
                            setSelectedColors((prev) =>
                              prev.includes(color)
                                ? prev.filter((c) => c !== color)
                                : [...prev, color]
                            );
                          }}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizes"
              render={() => (
                <FormItem>
                  <FormLabel>O'lchamlar (ixtiyoriy)</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={() => {
                            setSelectedSizes((prev) =>
                              prev.includes(size)
                                ? prev.filter((s) => s !== size)
                                : [...prev, size]
                            );
                          }}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Rasmlar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setImageFiles(e.target.files);
                          form.setValue("images", e.target.files);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Saqlash
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
