import { GeistSans } from "geist/font/sans";
import "./scss/globals.scss";
import "./scss/main.scss";
import { LayoutProvider } from "@/components/reducers/layout/layout-reducer";
import { LayoutStructure } from "../components/layout-structure";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "III BINGO CECOM",
  description: "Bingo do CECOM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <LayoutProvider>
          <LayoutStructure>{children}</LayoutStructure>
        </LayoutProvider>
      </body>
    </html>
  );
}

