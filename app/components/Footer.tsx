import Link from "next/link";
import ChangeLocationSelector from "@/app/components/ChangeLocationSelector";

type FooterProps = {
  locate?: string;
};
export default function Footer({ locate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-neutral-300 h-13 flex items-center justify-between">
      <div className="text-sm text-gray-500">© 2018&ndash;2026 DNS-Markdown. Версия 2.0.0.</div>
      <div className="text-sm text-gray-500 flex gap-4">
        <ChangeLocationSelector locate={locate} />
        <Link href="/disclaimer">
          <span className="text-blue-500 hover:underline">Отказ от ответственности</span>
        </Link>
      </div>
    </footer>
  );
}
