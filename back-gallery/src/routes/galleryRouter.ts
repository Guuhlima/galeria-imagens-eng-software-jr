import { FastifyInstance } from "fastify";
import { galleryCreate, galleryUpdate, galleryUpload, listGallery, galleryDelete, galleryToggleAtiva, galleryGetById } from "../controllers/galleryController";

export async function galleryRouter(app: FastifyInstance) {
  app.get("/gallery", listGallery);
  app.post("/gallery", galleryCreate);
  app.post("/gallery/:galleryId/upload", galleryUpload);
  app.get("/gallery/:galleryId", galleryGetById);
  app.put("/gallery/:galleryId", galleryUpdate);
  app.delete("/gallery/:galleryId", galleryDelete);
  app.patch("/gallery/:galleryId/active", galleryToggleAtiva); 
}