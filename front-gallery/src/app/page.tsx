import Navbar from "./components/Navbar";
import Header from "./components/Header";
import { Suspense } from "react";
import GalleryClientPage from "./create/GalleryClientPage";

export default function GalleryPage() {
  return (
    <main>
      <Navbar />
      <Header />
      <Suspense fallback={<p>Carregando galeria...</p>}>
        <GalleryClientPage />
      </Suspense>
    </main>
  );
}
