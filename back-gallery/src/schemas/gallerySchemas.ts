import { Type } from '@sinclair/typebox';

export const GalleryParams = Type.Object({
  galleryId: Type.Integer(),
});

export const GalleryQuery = Type.Object({
  limit: Type.Optional(Type.String()),
  offset: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()), 
});

export const GalleryCreateBody = Type.Object({
  title: Type.String(),
  url: Type.String({ format: 'uri' }),
});

export const GalleryUpdateBody = Type.Partial(GalleryCreateBody);
