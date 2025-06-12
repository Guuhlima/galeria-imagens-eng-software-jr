import { FastifyInstance } from "fastify";
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
  GalleryParams,
  GalleryQuery,
  GalleryCreateBody,
  GalleryUpdateBody,
} from '../schemas/gallerySchemas';
import {
  galleryCreate,
  galleryUpload,
  galleryUpdate,
  galleryDelete,
  galleryToggleAtiva,
  galleryGetById,
  listGallery,
} from '../controllers/galleryController';

export async function galleryRouter(app: FastifyInstance) {
  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'GET',
    url: '/gallery',
    schema: { querystring: GalleryQuery },
    handler: listGallery,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'POST',
    url: '/gallery',
    schema: { body: GalleryCreateBody },
    handler: galleryCreate,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'POST',
    url: '/gallery/:galleryId/upload',
    schema: { params: GalleryParams },
    handler: galleryUpload,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'GET',
    url: '/gallery/:galleryId',
    schema: { params: GalleryParams },
    handler: galleryGetById,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'PUT',
    url: '/gallery/:galleryId',
    schema: {
      params: GalleryParams,
      body: GalleryUpdateBody,
    },
    handler: galleryUpdate,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'DELETE',
    url: '/gallery/:galleryId',
    schema: { params: GalleryParams },
    handler: galleryDelete,
  });

  app.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'PATCH',
    url: '/gallery/:galleryId/active',
    schema: { params: GalleryParams },
    handler: galleryToggleAtiva,
  });
}
