import Link from "next/link";
import GalleryForm from "./GalleryForm";

export default function CreateGalleryPage() {
    return (
        <main className="p-8">
            <Link href="/" className="p-4 rounded-lg">
                Voltar
            </Link>
            <h1 className="text-3xl font-bold text-center mb-6">Criar Galeria</h1>
            <GalleryForm />
        </main>
    );
}
