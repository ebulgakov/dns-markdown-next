type PageSubTitleProps = {
  title: string;
};
export default function PageSubTitle({ title }: PageSubTitleProps) {
  return <h2 className="text-2xl">{title}</h2>;
}
