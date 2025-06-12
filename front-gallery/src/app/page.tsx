import { Suspense } from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import GalleryGrid from "./components/GalleryGrid";

export const revalidate = 10;

export default function Page() {
  return (
    <main>
      <Navbar />
      <Header />
      <div className="px-4 sm:px-8 md:px-16">
        <Suspense fallback={<p>Carregando galeria...</p>}>
          <GalleryGrid />
        </Suspense>
      </div>
    </main>
  );
}
