import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartProvider } from '@/app/context/cart-context'
import { CartDrawer } from '@/components/layout/cart-drawer'
import { Chatbot } from '@/components/chat/chatbot' 

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MIA Beauty',
  description: 'Natural Beauty Essentials',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        {/* CartProvider wraps the whole app so cart state is global */}
        <CartProvider>
          <Header />
          
          {/* CartDrawer is the slide-out bag */}
          <CartDrawer />
          
          {/* Chatbot is placed here to be visible on every page */}
          <Chatbot />
          
          <main className="flex-grow relative w-full">
            {children}
          </main>
          
          {/* Added ID to allow scrolling to footer */}
          <div id="footer">
            <Footer />
          </div>
          
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}