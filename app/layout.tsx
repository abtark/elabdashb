import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers"; // We will create this

const ubuntu = Ubuntu({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "EntryLab",
  description: "Advanced Glass Dashboard",
  icons: { icon: "https://iili.io/FC3fr7f.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.variable} font-ubuntu antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
