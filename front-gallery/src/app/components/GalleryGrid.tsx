import { convertUrl } from "@/lib/utils";
import Link from "next/link";
import GalleryItem from "./GalleryItem";

type GalleryItemType = {
  id: number;
  title: string;
  url: string;
  active?: boolean;
};

interface Props {
  images: GalleryItemType[];
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
          <GalleryItem
            key={img.id}
            id={img.id}
            title={img.title}
            url={convertUrl(img.url)}
            active={img.active ?? true}
          />
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
