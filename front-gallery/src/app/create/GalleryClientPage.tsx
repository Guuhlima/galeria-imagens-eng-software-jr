'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilterButtons from '../components/FilterButtons';
import GalleryGrid from '../components/GalleryGrid';
import { apiFetch } from '@/lib/api';

export default function GalleryClientPage() {
  const searchParams = useSearchParams();
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') || 'all';
  const limit = 12;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const query = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    if (status !== 'all') {
      query.set('status', status);
    }

    apiFetch(`/gallery?${query.toString()}`, { method: 'GET' })
      .then((res) => {
        setImages(res.rows);
        setTotalPages(res.total_paginas);
      })
      .catch((err) => console.error("Erro ao buscar dados:", err));
  }, [page, status, offset]);

  return (
    <div className="px-4 sm:px-8 md:px-16">
      <FilterButtons status={status} />
      <GalleryGrid
        images={images}
        totalPages={totalPages}
        page={page}
        status={status}
      />
    </div>
  );
}
