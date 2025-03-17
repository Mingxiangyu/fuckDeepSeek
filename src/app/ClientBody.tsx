"use client";

import { useEffect } from "react";

type ClientBodyProps = {
  children: React.ReactNode;
};

export default function ClientBody({ children }: ClientBodyProps) {
  useEffect(() => {
    // Code here will run in the browser
  }, []);

  return <>{children}</>;
}
