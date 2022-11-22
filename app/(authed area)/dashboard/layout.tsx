import { Suspense } from "react";

/* eslint-disable @next/next/no-head-element */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
