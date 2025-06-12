export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import Link from "next/link";
import EditGalleryPage from "./EditGallery";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  return (
    <main className="p-8">
      <Link href="/" className="p-4 rounded-lg block mb-4 bg-gray-200 hover:bg-gray-300">
        ← Voltar
      </Link>
      <EditGalleryPage id={id} />
    </main>
  );
}
