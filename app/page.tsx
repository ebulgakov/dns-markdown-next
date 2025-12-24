import Link from "next/link";

export default function Home() {
  return (
    <div>
      This is a landing page.&nbsp;
      <Link href="/sign-in">
        <span className="text-blue-500 hover:underline">Please auth before</span>
      </Link>
    </div>
  );
}
