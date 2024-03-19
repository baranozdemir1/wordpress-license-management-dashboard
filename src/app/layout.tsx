import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@/providers/NextUIProvider";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WordPress Theme License Management System",
  description: "Baran Özdemir",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NextUIProvider>{children}</NextUIProvider>

        <Toaster
          toastOptions={{
            className: "rounded-sm p-4 pr-6 shadow-lg transition-all text-sm",
            position: "bottom-right",
            style: {
              borderRadius: "0.25rem",
            },
          }}
        />
      </body>
    </html>
  );
}
