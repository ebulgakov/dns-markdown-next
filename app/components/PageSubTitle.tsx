type PageSubTitleProps = {
  title: string;
};
export default function PageSubTitle({ title }: PageSubTitleProps) {
  return <h2 className="text-2xl mt-10 mb-2">{title}</h2>;
}
