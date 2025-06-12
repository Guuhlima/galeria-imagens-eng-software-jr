export type ImageStatus = "all" | "active" | "inactive";

export interface ImageItem {
  id: number;
  title: string;
  url: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedImageResponse {
  data: ImageItem[];
  pagination: PaginationMeta;
}
