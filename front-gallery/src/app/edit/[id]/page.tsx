"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import EditGalleryPage from "./EditGallery";

export default function EditPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <main className="p-8">
      <Link href="/" className="p-4 rounded-lg block mb-4 bg-gray-200 hover:bg-gray-300">
        Voltar
      </Link>
      {id && <EditGalleryPage id={id} />}
    </main>
  );
}
