import { convertUrl } from "@/lib/utils";
import Link from "next/link";
import GalleryActions from "./GalleryActions";

type GalleryItem = {
  id: number;
  title: string;
  url: string;
  active?: boolean;
};

interface Props {
  images: GalleryItem[];
  totalPages: number;
  page: number;
  status: string;
}

export default function GalleryGrid({ images, totalPages, page, status }: Props) {
  const queryString = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set("page", String(pageNumber));
    if (status !== "all") params.set("status", status);
    return `?${params.toString()}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="border rounded shadow p-4">
            <img
              src={convertUrl(img.url)}
              alt={img.title}
              className="w-full h-[300px] object-cover rounded"
            />
            <h2 className="mt-2 font-semibold text-lg">{img.title}</h2>
            <div className="flex gap-2 mt-2">
              <Link href="create" className="bg-gray-600 text-white px-4 py-2 rounded">
                Add
              </Link>
            </div>
            <GalleryActions id={img.id} active={img.active ?? true} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2 flex-wrap">
        {page > 1 && (
          <Link href={queryString(page - 1)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Anterior
          </Link>
        )}

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          return (
            <Link
              key={pageNumber}
              href={queryString(pageNumber)}
              className={`px-4 py-2 rounded ${
                pageNumber === page
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}

        {page < totalPages && (
          <Link href={queryString(page + 1)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Próxima
          </Link>
        )}
      </div>
    </div>
  );
}
