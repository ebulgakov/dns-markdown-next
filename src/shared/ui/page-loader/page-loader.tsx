import Image from "next/image";

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Image src="/img/spinner.svg" width={100} height={100} alt="Loading..." />
    </div>
  );
}

export { PageLoader };
