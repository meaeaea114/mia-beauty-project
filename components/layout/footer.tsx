import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#FAF9F6] dark:bg-[#0a0a0a] border-t border-stone-200 dark:border-stone-800 pt-24 pb-12 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            
            {/* Column 1: Brand (Social Buttons Removed) */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1a1a1a] dark:text-white">
                    MIA
                </h2>
                <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
                    Beauty for real life. Cruelty-free, paraben-free, and designed for you.
                </p>
                {/* BUTTONS REMOVED HERE */}
            </div>

            {/* Column 2: SHOP */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#AB462F] mb-6">Shop</h3>
                <ul className="space-y-4 text-sm font-medium text-stone-600 dark:text-stone-400">
                    <li><Link href="/shop#lips" className="hover:text-[#AB462F] transition-colors">Lips</Link></li>
                    <li><Link href="/shop#cheeks" className="hover:text-[#AB462F] transition-colors">Cheeks</Link></li>
                    <li><Link href="/shop#face" className="hover:text-[#AB462F] transition-colors">Face</Link></li>
                    <li><Link href="/shop#eyes" className="hover:text-[#AB462F] transition-colors">Eyes</Link></li>
                    <li><Link href="/best-sellers" className="hover:text-[#AB462F] transition-colors">Best Sellers</Link></li>
                </ul>
            </div>

            {/* Column 3: HELP */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#AB462F] mb-6">Help</h3>
                <ul className="space-y-4 text-sm font-medium text-stone-600 dark:text-stone-400">
                    <li><Link href="/help/contact" className="hover:text-[#AB462F] transition-colors">Contact Us</Link></li>
                    <li><Link href="/help/faq" className="hover:text-[#AB462F] transition-colors">FAQs</Link></li>
                    <li><Link href="/help/shipping" className="hover:text-[#AB462F] transition-colors">Shipping & Returns</Link></li>
                    <li><Link href="/help/track-order" className="hover:text-[#AB462F] transition-colors">Track Order</Link></li>
                </ul>
            </div>

            {/* Column 4: RESOURCES */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#AB462F] mb-6">Resources</h3>
                <ul className="space-y-4 text-sm font-medium text-stone-600 dark:text-stone-400">
                    <li><Link href="/legal/privacy" className="hover:text-[#AB462F] transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/legal/terms" className="hover:text-[#AB462F] transition-colors">Terms of Service</Link></li>
                </ul>
            </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-400">
                &copy; 2024 MIA Beauty Inc. All rights reserved.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
                Manila, PH
            </p>
        </div>

      </div>
    </footer>
  )
}