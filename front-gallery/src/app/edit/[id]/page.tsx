"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function EditGalleryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`http://localhost:3333/gallery/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setCurrentUrl(data.url);
    }
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`http://localhost:3333/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      await fetch(`http://localhost:3333/gallery/${id}/upload`, {
        method: "POST",
        body: formData,
      });
    }

    alert("Imagem atualizada com sucesso!");
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Editar Galeria</h2>

      {currentUrl && (
        <Image
          src={`http://localhost:3333${currentUrl}`}
          alt={title}
          width={300}
          height={200}
          className="mb-4"
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
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
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
