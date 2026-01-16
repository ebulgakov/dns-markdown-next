"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useEffect, Suspense } from "react";
import "nprogress/nprogress.css";

// Configure NProgress if needed (e.g., to hide the spinner)
NProgress.configure({ showSpinner: false });

function NProgressDone() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log(pathname, searchParams);
    NProgress.done();
    // You can also add a return function for NProgress.start() here
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  // useEffect(() => {
  //   NProgress.start();
  //   return () => {
  //     NProgress.done();
  //   };
  // }, [router]);

  return null;
}

export default function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  console.log("ProgressBarProvider rendered");
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <NProgressDone />
      </Suspense>
    </>
  );
}

export { ProgressBarProvider };
