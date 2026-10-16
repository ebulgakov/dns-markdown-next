import type { ReactNode } from "react";

type PageTitleProps = {
  title: string;
  subTitle?: string;
  children?: ReactNode;
};
function PageTitle({ title, subTitle, children }: PageTitleProps) {
  return (
    <div className="my-5 flex flex-col justify-between border-b border-solid border-b-neutral-300 py-5 md:flex-row md:items-end">
      <h1 className="text-3xl md:text-4xl">
        {title}{" "}
        {subTitle && (
          <small className="text-[65%] leading-none font-normal text-gray-500">{subTitle}</small>
        )}
      </h1>
      {children}
    </div>
  );
}

export { PageTitle };
