import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div>
      <h1 className="mt-2 mb-5 border-b border-gray-200 pb-2 text-5xl tracking-tight sm:text-6xl">
        {t("title")}
      </h1>
      <div className="space-y-4">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {t.markup("text", {
            lead: chunks => `<p class="text-xl">${chunks}</p>`,
            border: chunks =>
              `<p class="border border-gray-200 shadow-sm my-4 px-5 py-2 rounded-sm">${chunks}</p>`
          })}
        </ReactMarkdown>
      </div>
    </div>
  );
}
