import type { ReactNode } from "react";

type PageTitleProps = {
  title: string;
  subTitle?: string;
  children?: ReactNode;
};
export default function PageTitle({ title, subTitle, children }: PageTitleProps) {
  return (
    <div className="flex justify-between items-end border-b border-solid border-b-neutral-300  my-5 py-5 bg-white ">
      <h1 className="text-4xl">
        {title}{" "}
        {subTitle && (
          <small className="font-normal leading-none text-[#777777] text-[65%]">{subTitle}</small>
        )}
      </h1>
      {children}
    </div>
  );
}
