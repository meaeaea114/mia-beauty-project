"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    // Updated background to "The Blue One" (Dark Navy)
    <footer className="bg-[#0F172A] text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          
          {/* SHOP */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/60">Shop</h3>
            <ul className="space-y-4 text-sm font-light text-stone-300">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/60">Help</h3>
            <ul className="space-y-4 text-sm font-light text-stone-300">
              <li><Link href="/help/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/help/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/help/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/help/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* ABOUT - Careers Removed */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/60">About</h3>
            <ul className="space-y-4 text-sm font-light text-stone-300">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/about/ingredients" className="hover:text-white transition-colors">Ingredients</Link></li>
              <li><Link href="/about/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/60">Newsletter</h3>
            <p className="text-sm text-stone-300 mb-6 leading-relaxed">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-stone-500"
              />
              <Button className="w-full h-12 rounded-full bg-[#E6D5C4] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                Subscribe
              </Button>
            </form>
            <p className="text-[10px] text-stone-500 mt-4 leading-tight">
              By subscribing, you agree to our <Link href="/legal/privacy" className="underline hover:text-white">Privacy Policy</Link> and <Link href="/legal/terms" className="underline hover:text-white">Terms</Link>.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-wider text-stone-500">
            © 2024 MIA BEAUTY INC.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-[10px] uppercase tracking-wider text-stone-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="text-[10px] uppercase tracking-wider text-stone-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}