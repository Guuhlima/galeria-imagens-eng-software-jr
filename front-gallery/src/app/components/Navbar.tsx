import Link from "next/link";

const Navbar = () => (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Gallery</h1>
        <ul className="flex gap-4">
            <Link href="create" className="p-4 rounded-lg">
                Nova Galeria
            </Link>
        </ul>
    </nav>
);

export default Navbar;
