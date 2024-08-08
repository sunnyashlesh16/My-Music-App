import type { Metadata } from "next";
import { Saira } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToastProvider from "@/providers/ToasterProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";
import Player from "@/components/Player";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";

const font = Saira({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Spotify",
  description: "To get started the web developmemnt",
};

export const revalidate=0;
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToastProvider/>
        <SupabaseProvider>
          <UserProvider>
              <ModalProvider products ={products}/>
              <Sidebar songs={userSongs}>
                {children}
              </Sidebar>
              <Player/>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
