"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { apiFetch, apiUpload } from "@/lib/api";

interface EditGalleryPageProps {
  id: string;
}

export default function EditGalleryPage({ id }: EditGalleryPageProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await apiFetch(`/gallery/${id}`);
        setTitle(data.title || "");
        setCurrentUrl(data.url || "");
      } catch {
        Swal.fire("Erro", "Erro ao carregar dados da galeria", "error");
      }
    };

    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiFetch(`/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadResult = await apiUpload(`/gallery/${id}/upload`, "POST", formData);
        if (!uploadResult?.ok) throw new Error(uploadResult.message);
      }

      await Swal.fire("Sucesso", "Imagem atualizada com sucesso!", "success");
      router.push("/");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Erro ao atualizar galeria";
      Swal.fire("Erro", errMsg, "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Editar Galeria</h2>

      {(previewUrl || currentUrl) && (
        <Image
          src={previewUrl || `${process.env.NEXT_PUBLIC_API_URL}${currentUrl}`}
          alt={title}
          width={300}
          height={200}
          className="mb-4 rounded"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nova Imagem</label>
          <label className="inline-block bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600">
            Escolher imagem
            <input type="file" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
