import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/features/demo/demo-provider";

export const metadata: Metadata = {
  title: { default: "EmpresTI", template: "%s · EmpresTI" },
  description: "Controle interno de empréstimos de equipamentos de TI"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
