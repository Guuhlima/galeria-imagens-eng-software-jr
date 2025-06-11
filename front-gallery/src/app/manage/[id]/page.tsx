import { apiFetch } from "@/lib/api";
import GalleryItem from "@/app/components/GalleryItem";

interface Props {
  params: { id: string };
}

export default async function ManageImagePage({ params }: Props) {
  const gallery = await apiFetch(`/gallery/${params.id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!gallery) {
    return <p>Imagem não encontrada</p>;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="p-8">
      <GalleryItem
        id={gallery.id}
        title={gallery.title}
        url={`${apiBaseUrl}${gallery.url}`}
        active={gallery.active}
      />
    </div>
  );
}
