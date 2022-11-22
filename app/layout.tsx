/* eslint-disable @next/next/no-head-element */
import "../styles/globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body className={`w-full h-full flex flex-row`}>{children}</body>
    </html>
  );
}
