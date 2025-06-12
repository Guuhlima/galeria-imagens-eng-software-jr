"use client";

import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { useState } from "react";

interface GalleryItemProps {
  id: number;
  title: string;
  url: string;
  active: boolean;
  onDeleted?: () => void;
}

export default function GalleryItem({ id, title, url, active, onDeleted }: GalleryItemProps) {
  const [isActive, setIsActive] = useState(active);

  const handleDelete = async () => {
    const resultado = await Swal.fire({
      title: "Deseja deletar essa imagem?",
      text: "Essa ação após aceita não há mais volta",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    try {
      await apiFetch(`/gallery/${id}`, { method: "DELETE" });
      onDeleted?.();
    } catch {
      Swal.fire("Erro", "Não foi possível deletar a imagem", "error");
    }
  };

  const handleToggleAtiva = async () => {
    const result = await Swal.fire({
      title: `Deseja ${isActive ? "desativar" : "ativar"} esta imagem?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/gallery/${id}/active`, {
        method: "PATCH",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsActive((prev) => !prev);
    } catch {
      Swal.fire("Erro", "Não foi possível atualizar o status da imagem", "error");
    }
  };

  return (
    <div className="border rounded p-4 shadow-md text-center">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {url ? (
        <Image
          src={url}
          alt={title}
          width={200}
          height={200}
          className="mx-auto mb-2 rounded"
        />
      ) : (
        <div className="w-[200px] h-[200px] bg-gray-200 mx-auto mb-2 flex items-center justify-center text-sm text-gray-500 rounded">
          Sem imagem
        </div>
      )}

      <div className="flex justify-center gap-3">
        <Link href={`/edit/${id}`} className="text-blue-600 hover:underline">
          🖉 Editar
        </Link>

        <button onClick={handleDelete} className="text-red-600 hover:underline">
          🗑️ Deletar
        </button>

        <button onClick={handleToggleAtiva} className="hover:underline">
          {isActive ? (
            <span className="text-green-600">🟢 Ativo</span>
          ) : (
            <span className="text-red-600">🔴 Inativo</span>
          )}
        </button>
      </div>
    </div>
  );
}
