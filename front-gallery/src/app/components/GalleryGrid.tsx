"use client";

import Link from "next/link";
import GalleryItem from "./GalleryItem";
import { apiFetch } from "@/lib/api";
import { convertUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ImageItem, PaginatedImageResponse } from "@/models/imageItem";

export default function GalleryGrid() {
  const searchParams = useSearchParams();

  const pageParam = searchParams?.get("page");
  const statusParam = searchParams?.get("status");

  const page = Number(pageParam || "1");
  const status = statusParam === "active" || statusParam === "inactive" ? statusParam : "all";

  const [images, setImages] = useState<ImageItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadFlag, setReloadFlag] = useState(0);

  const handleReload = () => setReloadFlag((prev) => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      const limit = 12;
      const offset = (page - 1) * limit;
      const query = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });

      if (status !== "all") query.set("status", status);

      try {
        const res: PaginatedImageResponse = await apiFetch(`/gallery?${query.toString()}`);
        setImages(res.data);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        console.error("Erro ao buscar galeria:", err);
      }
    };

    fetchData();
  }, [page, status, reloadFlag]); 

  const queryString = (pageNumber: number) => {
    const params = new URLSearchParams();
    params.set("page", String(pageNumber));
    if (status !== "all") params.set("status", status);
    return `?${params.toString()}`;
  };

  const filterButton = (label: string, value: string) => {
    const isActive = status === value;
    return (
      <Link
        key={value}
        href={`?page=1${value !== "all" ? `&status=${value}` : ""}`}
        prefetch={false}
        className={`px-4 py-2 rounded ${
          isActive ? "bg-blue-700 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        {filterButton("🔘 Todos", "all")}
        {filterButton("✅ Ativos", "active")}
        {filterButton("❌ Inativos", "inactive")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">Nenhuma imagem encontrada.</p>
        ) : (
          images.map((img) => (
            <GalleryItem
              key={img.id}
              id={img.id}
              title={img.title}
              url={convertUrl(img.url)}
              active={img.active}
              onDeleted={handleReload}
            />
          ))
        )}
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
    </>
  );
}
