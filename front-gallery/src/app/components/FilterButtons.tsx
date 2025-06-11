import Link from "next/link";

interface Props {
  status: string;
}

export default function FilterButtons({ status }: Props) {
  const linkStyle = (active: boolean) =>
    `px-4 py-2 rounded ${
      active ? "bg-blue-700 text-white" : "bg-gray-200 text-black"
    }`;

  return (
    <div className="flex gap-4 mb-6">
      <Link href="?page=1" prefetch={false} className={linkStyle(status === "all")}>
        Todos
      </Link>
      <Link href="?page=1&status=active" prefetch={false} className={linkStyle(status === "active")}>
        Ativos
      </Link>
      <Link href="?page=1&status=inactive" prefetch={false} className={linkStyle(status === "inactive")}>
        Inativos
      </Link>
    </div>
  );
}
