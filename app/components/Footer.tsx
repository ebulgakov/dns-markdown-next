import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-300 h-13 flex items-center justify-between">
      <p className="text-sm text-gray-500">© 2018&ndash;2026 DNS-Markdown. Версия 2.0.0.</p>
      <p className="text-sm text-gray-500">
        <Link href="/disclaimer">
          <span className="text-blue-500 hover:underline">Отказ от ответственности</span>
        </Link>
      </p>
    </footer>
  );
}
