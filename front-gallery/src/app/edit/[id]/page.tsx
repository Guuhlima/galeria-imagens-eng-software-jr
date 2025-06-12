"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch, apiUpload } from "@/lib/api";

export default function EditGalleryPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : "";

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiFetch(`/gallery/${id}`, { method: "GET" });
        setTitle(data.title);
        setCurrentUrl(data.url);
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Erro ao carregar dados.";
        setMessage(errMsg);
      }
    }

    if (id) fetchData();
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
        body: JSON.stringify({ title }),
      });

      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadResult = await apiUpload(`/gallery/${id}/upload`, "POST", formData);
        if (!uploadResult?.ok) throw new Error(uploadResult.message);
      }

      setMessage("Imagem atualizada com sucesso!");

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Erro ao atualizar galeria";
      setMessage(errMsg);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Editar Galeria</h2>

      {(previewUrl || currentUrl) && (
        <Image
          src={previewUrl || `http://localhost:3333${currentUrl}`}
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
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nova Imagem</label>
          <label className="inline-block bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600">
            Escolher imagem
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>

        {message && <p className="text-center mt-4">{message}</p>}
      </form>
    </div>
  );
}
