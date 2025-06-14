"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, GalleryFormData } from "./schema";
import { apiFetch, apiUpload } from "@/lib/api";
import Image from "next/image";

export default function GalleryForm() {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const PLACEHOLDER_IMAGE = "https://placeholder.com/temporary.jpg";
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
  });

  const onSubmit = async (data: GalleryFormData) => {
    try {
      const result = await apiFetch("/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: data.title, url: PLACEHOLDER_IMAGE }),
      });

      const galleryId: number = result.gallery.id;

      const formData = new FormData();
      const file = data.image[0] as File;
      formData.append("file", file);

      const uploadResult = await apiUpload(
        `/gallery/${galleryId}/upload`,
        "POST",
        formData
      );

      if (!uploadResult?.ok) throw new Error(uploadResult.message);

      setMessage("Galeria criada com sucesso!");
      await router.push("/");
      setPreview(null);
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Erro ao criar galeria");
      }
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Upload image</h2>

      <div>
        <label className="block font-medium">Título</label>
        <input
          type="text"
          {...register("title")}
          className="w-full border p-2 rounded"
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Imagem</label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={handleImageChange}
          className="w-full bg-gray-700 text-white p-4 rounded-md hover:bg-gray-500"
        />
        {errors.image && (
          <p className="text-red-500">{errors.image.message as string}</p>
        )}
      </div>

      {preview && (
        <div className="border p-2 rounded text-center">
          <p className="font-medium mb-2">Image preview</p>
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={200}
            className="mx-auto rounded"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Upload
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
}
