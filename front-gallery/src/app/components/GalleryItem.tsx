"use client";

import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface GalleryItemProps {
  id: number;
  title: string;
  url: string;
  active: boolean;
}

export default function GalleryItem({ id, title, url, active }: GalleryItemProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const resultado = await Swal.fire({
      title: "Deseja deletar essa imagem?",
      text: "Essa ação após aceita não há mais volta",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      router.refresh();
    }
  };

  const handleToggleAtiva = async () => {
    const result = await Swal.fire({
      title: `Deseja ${active ? "desativar" : "ativar"} esta imagem?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await fetch(`/api/gallery/${id}/active`, { method: "PATCH" });
      router.refresh();
    }
  };

  return (
    <div className="border rounded p-4 shadow-md text-center">
      {url ? (
        <Image
          src={url}
          alt={title}
          width={200}
          height={200}
          className="mx-auto mb-2"
        />
      ) : (
        <div className="w-[200px] h-[200px] bg-gray-200 mx-auto mb-2 flex items-center justify-center text-sm text-gray-500 rounded">
          Sem imagem
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <div className="flex justify-center gap-3">
        <Link href={`/edit/${id}`} className="text-blue-600 hover:underline">
          Editar
        </Link>

        <button onClick={handleDelete} className="text-red-600 hover:underline">
          Deletar
        </button>

        <button onClick={handleToggleAtiva} className="hover:underline">
          {active ? "🟢 Ativo" : "🔴 Inativo"}
        </button>
      </div>
    </div>
  );
}
