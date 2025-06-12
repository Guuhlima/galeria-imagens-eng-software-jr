import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { resolve } from "path";
import { galleryRouter } from "./routes/galleryRouter";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyStatic from "@fastify/static";

dotenv.config();

const app = fastify().withTypeProvider<TypeBoxTypeProvider>();

app.register(multipart);

app.register(fastifyStatic, {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3001'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});

app.register(galleryRouter);

app
  .listen({ port: 3333, host: "0.0.0.0" })
  .then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
  });

export { app };
