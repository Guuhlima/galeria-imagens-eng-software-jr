"use client";

import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GalleryActions({ id, active }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Deseja deletar essa imagem?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await fetch(`${API_URL}/gallery/${id}`, { method: "DELETE" });
      router.refresh();
    }
  };

  const handleToggle = async () => {
    const result = await Swal.fire({
      title: `Deseja ${active ? "desativar" : "ativar"} essa imagem?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await fetch(`${API_URL}/gallery/${id}/active`, { method: "PATCH" });
      router.refresh();
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <Link href={`/edit/${id}`} className="text-blue-600 hover:underline">
        Editar
      </Link>

      <button onClick={handleDelete} className="text-red-600 hover:underline">
        Deletar
      </button>

      <button onClick={handleToggle} className="hover:underline">
        {active ? "🟢 Ativo" : "🔴 Inativo"}
      </button>
    </div>
  );
}
