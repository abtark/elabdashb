import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata = {
  title: "Login - Emanistation",
  description: "Secure Dashboard Access",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
        <link rel="icon" href="https://iili.io/FC3fr7f.png" />
      </head>
      <body className={`${ubuntu.variable} font-ubuntu antialiased`}>
        {children}
      </body>
    </html>
  );
}
