import { FastifyRequest, FastifyReply } from "fastify";
import { createWriteStream, unlinkSync, existsSync } from "fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { extname, resolve } from "path";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

interface CreateGalleryBody {
  title: string;
}

interface UpdateGalleryBody {
  title: string;
}

interface GalleryParams {
  galleryId: string;
}

interface ListQuery {
  limit?: string;
  offset?: string;
  search?: string;
  status?: string;
}

export async function galleryCreate(
  request: FastifyRequest<{ Body: CreateGalleryBody }>,
  reply: FastifyReply
) {
  const { title } = request.body;

  try {
    const galleryExist = await prisma.gallery.findFirst({ where: { title } });
    if (galleryExist) {
      return reply.status(400).send({ error: "Bad Request", message: "Já existe uma galeria com esse título" });
    }

    const gallery = await prisma.gallery.create({
      data: { title, filename: "", url: "" },
    });

    return reply.status(201).send({ message: "Galeria criada com sucesso", gallery });
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function galleryUpload(
  request: FastifyRequest<{ Params: GalleryParams }>,
  reply: FastifyReply
) {
  const file = await (request as any).file();
  const { galleryId } = request.params;

  try {
    const gallery = await prisma.gallery.findFirst({
      where: { id: Number(galleryId) },
    });

    if (!gallery) {
      return reply.status(404).send({ error: "Not Found", message: "Galeria não encontrada" });
    }

    if (!file) {
      return reply.status(400).send({ error: "Bad Request", message: "Nenhum arquivo enviado" });
    }

    if (gallery.filename) {
      const oldPath = resolve(__dirname, "../../uploads/", gallery.filename);
      if (existsSync(oldPath)) unlinkSync(oldPath);
    }

    const fileId = randomUUID();
    const extension = extname(file.filename);
    const fileName = `${fileId}${extension}`;
    const filePath = resolve(__dirname, "../../uploads/", fileName);

    await pump(file.file, createWriteStream(filePath));

    const updatedGallery = await prisma.gallery.update({
      where: { id: gallery.id },
      data: {
        filename: fileName,
        url: `/uploads/${fileName}`,
      },
    });

    return reply.status(200).send({ message: "Upload realizado com sucesso", gallery: updatedGallery });
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function galleryUpdate(
  request: FastifyRequest<{ Params: GalleryParams; Body: UpdateGalleryBody }>,
  reply: FastifyReply
) {
  const { galleryId } = request.params;
  const { title } = request.body;

  try {
    const gallery = await prisma.gallery.findUnique({ where: { id: Number(galleryId) } });
    if (!gallery) return reply.status(404).send({ error: "Not Found", message: "Galeria não encontrada" });

    const galleryExist = await prisma.gallery.findFirst({
      where: { title, NOT: { id: Number(galleryId) } },
    });

    if (galleryExist) {
      return reply.status(400).send({ error: "Bad Request", message: "Já existe uma galeria com esse título" });
    }

    const updated = await prisma.gallery.update({ where: { id: Number(galleryId) }, data: { title } });
    return reply.status(200).send({ message: "Galeria atualizada com sucesso", gallery: updated });
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function listGallery(
  request: FastifyRequest<{ Querystring: ListQuery }>,
  reply: FastifyReply
) {
  const { limit = "12", offset = "0", search = "", status = "all" } = request.query;

  try {
    const where: any = {};
    if (search) where.title = { contains: search, mode: "insensitive" };
    if (status === "active") where.active = true;
    else if (status === "inactive") where.active = false;

    const total = await prisma.gallery.count({ where });
    const rows = await prisma.gallery.findMany({
      where,
      skip: Number(offset),
      take: Number(limit),
      orderBy: { id: "asc" },
      select: { id: true, title: true, url: true, active: true },
    });

    return reply.send({
      data: rows,
      pagination: {
        page: Math.floor(Number(offset) / Number(limit)) + 1,
        limit: Number(limit),
        totalItems: total,
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(offset) + Number(limit) < total,
        hasPreviousPage: Number(offset) > 0,
      },
    });

  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function galleryDelete(
  request: FastifyRequest<{ Params: GalleryParams }>,
  reply: FastifyReply
) {
  const { galleryId } = request.params;

  try {
    const gallery = await prisma.gallery.findUnique({ where: { id: Number(galleryId) } });
    if (!gallery) return reply.status(404).send({ error: "Not Found", message: "Galeria não encontrada" });

    if (gallery.filename) {
      const filePath = resolve(__dirname, "../../uploads/", gallery.filename);
      if (existsSync(filePath)) unlinkSync(filePath);
    }

    await prisma.gallery.delete({ where: { id: Number(galleryId) } });
    return reply.status(200).send({ message: "Galeria deletada com sucesso" });
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function galleryToggleAtiva(
  request: FastifyRequest<{ Params: GalleryParams }>,
  reply: FastifyReply
) {
  const { galleryId } = request.params;

  try {
    const gallery = await prisma.gallery.findUnique({ where: { id: Number(galleryId) } });
    if (!gallery) return reply.status(404).send({ error: "Not Found", message: "Galeria não encontrada" });

    const updated = await prisma.gallery.update({
      where: { id: Number(galleryId) },
      data: { active: !gallery.active },
    });

    return reply.status(200).send({
      message: `Galeria ${updated.active ? "ativada" : "desativada"} com sucesso`,
      gallery: updated,
    });
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function galleryGetById(
  request: FastifyRequest<{ Params: GalleryParams }>,
  reply: FastifyReply
) {
  const { galleryId } = request.params;

  try {
    const gallery = await prisma.gallery.findUnique({ where: { id: Number(galleryId) } });
    if (!gallery) return reply.status(404).send({ error: "Not Found", message: "Galeria não encontrada" });
    return reply.status(200).send(gallery);
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}
