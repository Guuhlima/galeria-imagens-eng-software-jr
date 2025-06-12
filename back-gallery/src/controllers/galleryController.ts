import { FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import { Static } from "@sinclair/typebox";
import { createWriteStream, unlinkSync, existsSync } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { extname, resolve } from "path";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import {
  GalleryCreateBody,
  GalleryUpdateBody,
  GalleryParams,
  GalleryQuery,
} from "../schemas/gallerySchemas";

interface GalleryUploadRequest extends FastifyRequest<{
  Params: Static<typeof GalleryParams>;
}> {
  file: () => Promise<MultipartFile>;
}

const pump = promisify(pipeline);

export async function galleryCreate(
  request: FastifyRequest<{ Body: Static<typeof GalleryCreateBody> }>,
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
  request: FastifyRequest<{ Params: Static<typeof GalleryParams> }>,
  reply: FastifyReply
) {
  const file = await (request as any).file() as MultipartFile;
  const { galleryId } = request.params;

  try {
    const gallery = await prisma.gallery.findFirst({
      where: { id: Number(galleryId) },
    });

    if (!gallery)
      return reply.status(404).send({
        error: "Not Found",
        message: "Galeria não encontrada",
      });

    if (!file)
      return reply.status(400).send({
        error: "Bad Request",
        message: "Nenhum arquivo enviado",
      });

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

    return reply.status(200).send({
      message: "Upload realizado com sucesso",
      gallery: updatedGallery,
    });
  } catch (error: any) {
    return reply.status(500).send({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

export async function galleryUpdate(
  request: FastifyRequest<{
    Params: Static<typeof GalleryParams>;
    Body: Static<typeof GalleryUpdateBody>;
  }> ,
  reply: FastifyReply
) {
  const { galleryId } = request.params;
  const { title } = request.body;

  try {
    const gallery = await prisma.gallery.findUnique({ where: { id: Number(galleryId) } });
    if (!gallery) return reply.status(404).send({ error: "Not Found", message: "Galeria não encontrada" });

    const galleryExist = await prisma.gallery.findFirst({ where: { title, NOT: { id: Number(galleryId) } } });
    if (galleryExist) return reply.status(400).send({ error: "Bad Request", message: "Título já existe" });

    const updated = await prisma.gallery.update({ where: { id: Number(galleryId) }, data: { title } });
    return reply.status(200).send({ message: "Galeria atualizada com sucesso", gallery: updated });
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function listGallery(
  request: FastifyRequest<{ Querystring: Static<typeof GalleryQuery> }>,
  reply: FastifyReply
) {
  const limit = parseInt(request.query.limit ?? '12', 10);
  const offset = parseInt(request.query.offset ?? '0', 10);
  const search = request.query.search ?? '';
  const status = request.query.status ?? 'all';

  try {
    const where: any = {};
    if (search) where.title = { contains: search, mode: "insensitive" };
    if (status === "active") where.active = true;
    else if (status === "inactive") where.active = false;

    const total = await prisma.gallery.count({ where });
    const rows = await prisma.gallery.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { id: "asc" },
      select: { id: true, title: true, url: true, active: true },
    });

    return reply.send({
      data: rows,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: offset + limit < total,
        hasPreviousPage: offset > 0,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({ error: "Internal Server Error", message: error.message });
  }
}

export async function galleryDelete(
  request: FastifyRequest<{ Params: Static<typeof GalleryParams> }> ,
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
  request: FastifyRequest<{ Params: Static<typeof GalleryParams> }> ,
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
  request: FastifyRequest<{ Params: Static<typeof GalleryParams> }> ,
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