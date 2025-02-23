"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
} from "@/lib/service/api";

const AddProduct = ({ onClose }: { onClose: () => void }) => {
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetCategoriesQuery({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("category_id", String(formData.category));
    productData.append("price", String(formData.price));

    images.forEach((image) => {
      productData.append("images", image);
    });

    try {
      await createProduct(productData).unwrap();
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
      });
      setImages([]);
      setImagePreviews([]);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Product creation failed!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories?.map((category :any) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price (so'm)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
