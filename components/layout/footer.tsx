"use client"

import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-xl pt-16 pb-8 text-stone-900 dark:text-white transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Brand Description */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#AB462F]">MIA Beauty</h2>
            </Link>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
              Beauty for real life. Consciously crafted, cruelty-free essentials designed to enhance your natural radiance.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Shop Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#AB462F]">Shop</h4>
              <ul className="space-y-2.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                <li><Link href="/shop#lips" className="hover:text-[#AB462F] transition-colors">Lips</Link></li>
                <li><Link href="/shop#cheeks" className="hover:text-[#AB462F] transition-colors">Cheeks</Link></li>
                <li><Link href="/shop#face" className="hover:text-[#AB462F] transition-colors">Face</Link></li>
                <li><Link href="/shop#skin" className="hover:text-[#AB462F] transition-colors">Skin</Link></li>
                <li><Link href="/shop#eyes" className="hover:text-[#AB462F] transition-colors">Eyes</Link></li>
                <li><Link href="/shop#brows" className="hover:text-[#AB462F] transition-colors">Brows</Link></li>
                <li className="pt-2"><Link href="/best-sellers" className="hover:text-[#AB462F] transition-colors font-bold">Best Sellers</Link></li>
              </ul>
            </div>

            {/* About Column - REMOVED CAREERS */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#AB462F]">About</h4>
              <ul className="space-y-2.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                <li><Link href="/about" className="hover:text-[#AB462F] transition-colors">Our Story</Link></li>
                <li><Link href="/about/ingredients" className="hover:text-[#AB462F] transition-colors">Ingredients</Link></li>
                <li><Link href="/about/sustainability" className="hover:text-[#AB462F] transition-colors">Sustainability</Link></li>
              </ul>
            </div>

            {/* Help Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#AB462F]">Help</h4>
              <ul className="space-y-2.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                <li><Link href="/help/faq" className="hover:text-[#AB462F] transition-colors">FAQ</Link></li>
                <li><Link href="/help/shipping" className="hover:text-[#AB462F] transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/help/track-order" className="hover:text-[#AB462F] transition-colors">Track Order</Link></li>
                <li><Link href="/help/contact" className="hover:text-[#AB462F] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Account/Legal Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#AB462F]">Account</h4>
              <ul className="space-y-2.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                <li><Link href="/account/login" className="hover:text-[#AB462F] transition-colors">Log In</Link></li>
                <li><Link href="/account/register" className="hover:text-[#AB462F] transition-colors">Create Account</Link></li>
                <li className="pt-4 text-stone-400 dark:text-stone-500 font-normal">Legal</li>
                <li><Link href="/legal/privacy" className="hover:text-[#AB462F] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-[#AB462F] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-stone-200 dark:border-white/10 gap-4">
          
          {/* Copyright */}
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            © {new Date().getFullYear()} MIA Beauty Inc. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}