import { FastifyInstance } from "fastify";
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
  app.get('/gallery', {
    schema: { querystring: GalleryQuery },
    handler: listGallery,
  });

  app.post('/gallery', {
    schema: { body: GalleryCreateBody },
    handler: galleryCreate,
  });

  app.post('/gallery/:galleryId/upload', {
    schema: { params: GalleryParams },
    handler: galleryUpload,
  });

  app.get('/gallery/:galleryId', {
    schema: { params: GalleryParams },
    handler: galleryGetById,
  });

  app.put('/gallery/:galleryId', {
    schema: {
      params: GalleryParams,
      body: GalleryUpdateBody,
    },
    handler: galleryUpdate,
  });

  app.delete('/gallery/:galleryId', {
    schema: { params: GalleryParams },
    handler: galleryDelete,
  });

  app.patch('/gallery/:galleryId/active', {
    schema: { params: GalleryParams },
    handler: galleryToggleAtiva,
  });
}
