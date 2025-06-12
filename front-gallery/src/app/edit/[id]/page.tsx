
import Link from "next/link";
import EditGalleryPage from "./EditGalleryPage";

export default function EditPage() {
  return (
    <main className="p-8">
      <Link href="/" className="p-4 rounded-lg block mb-4">
            Voltar
      </Link>
      <EditGalleryPage />
    </main>
  );
}
