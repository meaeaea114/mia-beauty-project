"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X, ArrowRight } from "lucide-react"

// UI Component Imports
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/app/context/cart-context"
import { ProductModal } from "@/components/shop/product-modal"
import type { Product } from "@/app/shop/page" 

// --- Data Constants ---
const STAYGLOSS_VARIANTS = [
  { id: 101, formula: "Chiffon", shade: "carnation pink", price: 395, image: "/images/Rectangle 87.png" },
  { id: 102, formula: "Cashmere", shade: "dusty pink", price: 395, image: "/images/Rectangle 91.png" },
  { id: 103, formula: "Suede", shade: "toasty nude", price: 395, image: "/images/Rectangle 99.png" },
  { id: 104, formula: "Silk", shade: "mauve nude", price: 395, image: "/images/Rectangle 93.png" },
  { id: 105, formula: "Satin", shade: "peachy rose", price: 395, image: "/images/Rectangle 99.png" },
  { id: 106, formula: "Velvet", shade: "berry mauve", price: 395, image: "/images/Rectangle 97.png" },
  { id: 107, formula: "Rouge", shade: "rosy pink", price: 395, image: "/images/Rectangle 101.png" },
];

// --- Helper Components ---
const Hotspot = ({ top, left, label, onClick, align = "right" }: any) => {
  return (
    <div 
        onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
        className="absolute z-50 w-12 h-12 cursor-pointer group/spot -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 ease-in-out" 
        style={{ top, left }}
    >
        <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm z-20 transition-all duration-500 ease-out group-hover/spot:bg-white group-hover/spot:scale-110 group-hover/spot:shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            <div className="absolute w-8 h-8 rounded-full border border-white/30 scale-0 opacity-0 group-hover/spot:scale-100 group-hover/spot:opacity-100 transition-all duration-700 ease-out" />
        </div>
        <div className={`absolute pointer-events-none opacity-0 group-hover/spot:opacity-100 transition-all duration-500 ease-out z-10 ${align === "left" ? "right-4 flex flex-row-reverse items-center pr-2" : ""} ${align === "right" ? "left-4 flex flex-row items-center pl-2" : ""}`}>
           <div className={`bg-white/80 shadow-[0_0_2px_rgba(255,255,255,0.5)] transition-all duration-500 ease-out w-0 group-hover/spot:w-8 h-[1px]`}></div>
           <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black bg-white/95 px-3 py-2 backdrop-blur-xl shadow-xl ml-0 whitespace-nowrap translate-y-1 opacity-0 group-hover/spot:translate-y-0 group-hover/spot:opacity-100 transition-all duration-500 delay-75">{label}</span>
        </div>
    </div>
  )
}

// --- 1. HERO SECTION (RESPONSIVE) ---
const HeroSection = ({ onOpenProduct }: { onOpenProduct: (product: Product) => void }) => {
  const HERO_PRODUCTS: Product[] = [
      { id: "l6", name: "Staygloss", tagline: "High-shine longwear lip gloss", price: 595, image: "/images/Rectangle 141.png", colors: ["#A81C26", "#B55A55"], variants: [{ name: "Sizzle", color: "#A81C26", image: "/images/Rectangle 141.png" }, { name: "Glaze", color: "#B55A55", image: "/images/Rectangle 141.png" }] },
      { id: "c5", name: "Glow On", tagline: "Light catching liquid highlighter", price: 359, image: "/images/Rectangle 145-1.png", colors: ["#E8DCCA", "#E3C9B0", "#D67F68"], variants: [{ name: "Champagne", color: "#E8DCCA", image: "/images/Rectangle 145-1.png" }, { name: "Gold", color: "#E3C9B0", image: "/images/Rectangle 145-1.png" }, { name: "Bronze", color: "#D67F68", image: "/images/Rectangle 145-1.png" }] }, 
      { id: "b1", name: "Grooming Gel", tagline: "Effortless sculpting gel", price: 389, image: "/images/Rectangle 144-7.png", colors: ["#5D4037", "#262626"], variants: [{ name: "Brown", color: "#5D4037", image: "/images/Rectangle 144-7.png" }, { name: "Black", color: "#262626", image: "/images/Rectangle 144-7.png" }] }
  ];

  return (
      // MODIFIED: Added dark mode background color to match body theme variable for smoothness
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col md:flex-row bg-[#EBE7E0] dark:bg-background overflow-hidden">
        
        {/* Text Content - Top on mobile, Left on desktop */}
        <div className="w-full md:w-[55%] flex flex-col justify-center px-6 md:px-20 lg:px-24 py-16 md:py-20 relative z-20 order-1 md:order-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="relative">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                 <div className="h-[1px] w-12 bg-[#AB462F]"></div>
                 <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#AB462F]">The New Standard</p>
              </div>
              <div className="relative mb-6 md:mb-8 select-none">
                {/* MODIFIED: Used custom CSS class for dynamic stroke color */}
                <h1 className="text-[18vw] md:text-[9rem] lg:text-[11rem] leading-[0.8] font-black tracking-tighter uppercase hero-stroke-text">Stay</h1>
                {/* MODIFIED: Added dark:text-white/90 for clear contrast in dark mode */}
                <h1 className="text-[18vw] md:text-[9rem] lg:text-[11rem] leading-[0.8] font-black tracking-tighter text-[#2D2420] dark:text-white/90 uppercase ml-2 md:ml-4 -mt-2 md:-mt-6 drop-shadow-xl">Gloss</h1>
              </div>
              
              <div className="mt-4 md:mt-12">
                  {/* MODIFIED: Added dark:text-stone-300 for clear contrast in dark mode */}
                  <p className="text-[#5A4D45] dark:text-stone-300 text-base md:text-xl leading-relaxed font-light max-w-xs md:max-w-md border-l-2 border-[#AB462F] pl-4 md:pl-6 tracking-wide">
                    High-shine finish. Zero stickiness. <br className="hidden md:block"/>
                    The gloss that changes everything.
                  </p>
              </div>
            </motion.div>
        </div>

        {/* Image Content - Bottom on mobile, Right on desktop */}
        <div className="w-full h-[50vh] md:h-full md:w-[50%] relative md:absolute md:right-0 md:top-0 md:bottom-0 z-10 order-2 md:order-2">
             <div className="relative w-full h-full group/image">
                 <img src="/images/image 17.png" alt="Mia Beauty Hero" className="w-full h-full object-cover object-[50%_20%] md:object-[25%_20%]" />
                 
                 {/* MODIFIED: Changed gradient stop in dark mode to match body background color */}
                 <div className="absolute inset-y-0 left-0 w-full h-20 md:h-full md:w-[20%] bg-gradient-to-b md:bg-gradient-to-r from-[#EBE7E0] dark:from-background to-transparent pointer-events-none -top-1 md:top-0" />
                 
                 <div className="absolute inset-0 z-40">
                     <div className="absolute top-[30%] left-[30%] md:top-[28%] md:left-[38%]"><Hotspot top="0%" left="0%" label="BROWS" onClick={() => onOpenProduct(HERO_PRODUCTS[2])} align="right" /></div>
                     <div className="absolute top-[50%] left-[50%] md:top-[48%] md:left-[43%]"><Hotspot top="0%" left="0%" label="GLOW" onClick={() => onOpenProduct(HERO_PRODUCTS[1])} align="left" /></div>
                     <div className="absolute top-[70%] left-[35%] md:top-[60%] md:left-[33%]"><Hotspot top="0%" left="0%" label="LIPS" onClick={() => onOpenProduct(HERO_PRODUCTS[0])} align="right" /></div>
                 </div>
             </div>
        </div>
      </section>
  )
}

// --- 2. CATEGORY GRID (RESPONSIVE) ---
const CategoryGrid = () => (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-0">
        {[
            {name:"Lips",img:"/images/lips.jpg"}, {name:"Brows",img:"/images/brows.jpg"},
            {name:"Eyes",img:"/images/eyes.jpg"}, {name:"Cheeks",img:"/images/cheeks.jpg"},
            {name:"Face",img:"/images/Rectangle 80.png"}
        ].map((cat, index) => (
          <Link key={index} href={`/shop#${cat.name.toLowerCase()}`} className="relative h-[300px] md:h-[550px] group cursor-pointer overflow-hidden block">
            <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 z-20">
               <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white/90 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-md">
                  {cat.name}
               </h3>
               
               <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
                   <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase border-b border-white pb-1 mt-3 block">
                     Shop Now
                   </span>
               </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
)

// --- 3. SHADE COLLECTION (RESPONSIVE) ---
const ShadeCollection = () => {
    const router = useRouter()
    return (
        // MODIFIED: Background is now fully transparent (bg-transparent) as requested.
        <section className="w-full py-16 md:py-24 bg-transparent relative overflow-hidden 
            border-t-4 border-b-4 border-stone-200/50 dark:border-stone-800/50 border-double"
        >
            <div className="absolute top-20 left-0 w-full text-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
                <h1 className="text-[20vw] md:text-[15vw] font-black uppercase leading-none text-foreground whitespace-nowrap">The Shades</h1>
            </div>
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 border-b border-stone-200 dark:border-white/10 pb-6">
                    <div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#AB462F] mb-3 block">The Collection</span>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">Meet The Shades</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-3 pb-2 text-stone-400">
                        <span className="text-[10px] font-bold tracking-widest uppercase">Swipe to explore</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 md:space-x-6 pb-12 no-scrollbar scroll-smooth"> 
                    {STAYGLOSS_VARIANTS.map((gloss) => (
                        <div 
                            key={gloss.id} 
                            className="w-[200px] md:w-[260px] flex-shrink-0 snap-center group cursor-pointer"
                            onClick={() => router.push('/shop#lips')}
                        >
                             {/* Keep the product cards opaque for contrast against the textured background */}
                             <div className="aspect-[3/4] w-full bg-white dark:bg-white/5 relative overflow-hidden mb-6 border border-stone-100 dark:border-white/10 transition-all duration-500 group-hover:shadow-2xl group-hover:border-[#AB462F]/20">
                                <div className="absolute inset-0 bg-[#AB462F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                <img src={gloss.image} alt={gloss.shade} className="w-full h-full object-contain p-6 md:p-8 relative z-10 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-3" />
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    <span className="text-[9px] font-bold uppercase tracking-widest bg-white dark:bg-[#1a1a1a] text-foreground px-4 py-2 rounded-full shadow-md">View Shade</span>
                                </div>
                            </div>
                            <div className="text-center transition-transform duration-500 group-hover:-translate-y-2">
                                <h3 className="font-bold text-lg md:text-xl uppercase tracking-tight text-foreground">{gloss.shade}</h3>
                                <p className="text-xs text-stone-500 font-medium uppercase tracking-widest mt-1 group-hover:text-[#AB462F] transition-colors">{gloss.formula}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 4. SHOP THE LOOK (RESPONSIVE) ---
const ShopTheLookSection = ({ onOpenModal }: { onOpenModal: (item: Product) => void }) => {
    const LOOK_PRODUCTS: Product[] = [
      { id: "look-tint", name: "Tinted Moisturizer", tagline: "oil-free tint", price: 430, image: "/images/Rectangle 147.png", colors: ["#EBEBEB"], variants: [{ name: "Porcelain", color: "#EBEBEB", image: "/images/Rectangle 68.png" }] },
      { id: "look-blush", name: "Blush On", tagline: "cheek pigment", price: 359, image: "/images/Rectangle 146.png", colors: ["#C67D6F", "#F28C98", "#F49F86"], variants: [{ name: "Sunset", color: "#C67D6F", image: "/images/Rectangle 146.png" }, { name: "Petal", color: "#F28C98", image: "/images/Rectangle 146.png" }, { name: "Coral", color: "#F49F86", image: "/images/Rectangle 146.png" }] },
      { id: "look-brow", name: "Grooming Gel", tagline: "grooming gel", price: 389, image: "/images/Rectangle 144-7.png", colors: ["#5D4037", "#262626"], variants: [{ name: "Brown", color: "#5D4037", image: "/images/Rectangle 144-7.png" }, { name: "Black", color: "#262626", image: "/images/Rectangle 144-7.png" }] },
      { id: "look-lip", name: "Fluffmatte", tagline: "matte lipstick", price: 399, image: "/images/Rectangle 131.png", colors: ["#B55A55", "#D67F68", "#E8A69D", "#A81C26", "#944E45"], variants: [{ name: "Girl Crush", color: "#B55A55", image: "/images/Rectangle 129.png" }, { name: "Vacay", color: "#D67F68", image: "/images/Rectangle 129.png" }, { name: "Milkshake", color: "#E8A69D", image: "/images/Rectangle 129.png" }, { name: "Major", color: "#A81C26", image: "/images/Rectangle 129.png" }, { name: "Baked", color: "#944E45", image: "/images/Rectangle 129.png" }] },
    ];
    
    return (
        // MODIFIED: Changed from high opacity/solid to semi-transparent
        <section className="w-full py-20 md:py-36 bg-white/50 dark:bg-black/50 relative">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    
                    {/* Text & Product List */}
                    <div className="lg:col-span-5 flex flex-col justify-center h-full space-y-10 md:space-y-12 order-2 lg:order-1">
                        <div>
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#AB462F] mb-4 block">Editorial</span>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-foreground mb-6">
                                Shop <br/> The Look
                            </h2>
                            <p className="text-stone-500 text-base md:text-lg font-light leading-relaxed max-w-sm">
                                Effortless beauty in four steps. Hover over the image to discover the essentials used to create this look.
                            </p>
                        </div>

                        <div className="space-y-0 divide-y divide-stone-200 dark:divide-white/10 border-t border-stone-200 dark:border-white/10">
                            {LOOK_PRODUCTS.map((product, idx) => (
                                <div 
                                    key={product.id} 
                                    className="group flex gap-4 md:gap-6 items-center py-4 md:py-6 cursor-pointer hover:pl-4 transition-all duration-300 ease-out"
                                    onClick={() => onOpenModal(product)}
                                >
                                    <span className="text-xs font-bold text-stone-300 group-hover:text-[#AB462F] transition-colors font-mono">0{idx + 1}</span>
                                    
                                    <div className="h-12 w-12 md:h-14 md:w-14 bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <img src={product.image} alt={product.name} className="w-7 h-7 md:w-8 md:h-8 object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    </div>
                                    
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-xs md:text-sm uppercase tracking-widest text-foreground group-hover:text-[#AB462F] transition-colors">{product.name}</h3>
                                            <span className="text-xs font-bold text-stone-400">₱{product.price}</span>
                                        </div>
                                        <p className="text-[10px] text-stone-500 uppercase tracking-wider">{product.tagline}</p>
                                    </div>

                                    <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block">
                                        <ArrowRight className="w-4 h-4 text-[#AB462F]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Model Image - Top on mobile, right on desktop */}
                    <div className="lg:col-span-7 relative group/image sticky top-24 order-1 lg:order-2">
                        <div className="relative aspect-[3/4] w-full h-full bg-stone-100 dark:bg-stone-800 overflow-hidden shadow-2xl rounded-sm">
                             <img src="/images/shop-look-portrait.jpg" alt="Shop the look model" className="w-full h-full object-cover object-center transition-transform duration-[2s] group-hover/image:scale-105" />
                             
                             <div className="absolute inset-0">
                                  <div className="absolute" style={{ top: '64%', left: '50%' }}><Hotspot top="0%" left="0%" label="LIPSTICK" onClick={() => onOpenModal(LOOK_PRODUCTS[3])} align="right" /></div>
                                  <div className="absolute" style={{ top: '53%', left: '30%' }}><Hotspot top="0%" left="0%" label="BLUSH" onClick={() => onOpenModal(LOOK_PRODUCTS[1])} align="left" /></div>
                                  <div className="absolute" style={{ top: '32%', left: '29%' }}><Hotspot top="0%" left="0%" label="BROWS" onClick={() => onOpenModal(LOOK_PRODUCTS[2])} align="right" /></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- 5. SKIN BANNER (RESPONSIVE) ---
const SkinBanner = ({ onShopNow }: { onShopNow: () => void }) => (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-transparent">
        <div className="container mx-auto">
            <div className="relative w-full h-[400px] md:h-[700px] overflow-hidden bg-[#E8E6E1] dark:bg-stone-900 shadow-2xl">
                <video 
                    src="/vid/Makeup_Tutorial_Video_Creation.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-90" 
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black/20 dark:bg-black/40">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
                      <h2 className="text-4xl md:text-6xl lg:text-9xl font-black text-white leading-none mb-6 md:mb-8 drop-shadow-xl uppercase tracking-tighter">The <span className="font-serif italic font-normal lowercase tracking-normal">perfect</span> <br /> Lip.</h2>
                      <Button size="lg" className="h-12 md:h-14 rounded-full bg-white text-black border-none px-8 md:px-10 font-bold tracking-[0.2em] uppercase hover:bg-[#AB462F] hover:text-white transition-all shadow-xl hover:scale-105 text-xs md:text-sm" onClick={onShopNow}>Shop Lips</Button>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);

// --- 6. PRESS SECTION (UPDATED - Images + Text) ---
const PressSection = () => (
    // MODIFIED: Changed from high opacity/solid to semi-transparent
    <section className="w-full pt-24 pb-4 bg-white/50 dark:bg-black/50 border-t border-stone-200 dark:border-white/10 relative">
      <div className="container mx-auto px-4 md:px-8">
          
          {/* APPLIED SUBTLE GLASSMORPHISM CONTAINER (NO BORDERS) */}
          <div className="rounded-[40px] 
            bg-white/50 dark:bg-black/50 
            backdrop-blur-2xl shadow-2xl p-8 md:p-12"
          >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 text-center">
                  
                  {/* Review 1 - ALLURE */}
                  <div className="flex flex-col items-center group">
                      <div className="aspect-square w-full max-w-[280px] bg-white/50 dark:bg-white/10 relative overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 backdrop-blur-sm shadow-sm">
                          <img src="/images/Rectangle 72.png" alt="Allure Press" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-serif italic text-4xl text-[#1a1a1a] dark:text-white mb-4">Allure</h3>
                      <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
                          "Filipino makeup brand <strong className="font-bold text-[#AB462F]">MIA</strong> makes just one lipstick and it's constantly selling out."
                      </p>
                  </div>

                  {/* Review 2 - NYLON */}
                  <div className="flex flex-col items-center group">
                      <div className="aspect-square w-full max-w-[280px] bg-white/50 dark:bg-white/10 relative overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 backdrop-blur-sm shadow-sm">
                          <img src="/images/Rectangle 73.png" alt="Nylon Press" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-serif font-bold text-3xl uppercase tracking-widest text-[#1a1a1a] dark:text-white mb-4">NYLON</h3>
                      <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
                          "This insta-famous label caught the beauty world's attention with its Fluffmatte lipsticks – sold out within 10 minutes of release."
                      </p>
                  </div>

                  {/* Review 3 - HYPEBAE */}
                  <div className="flex flex-col items-center group">
                      <div className="aspect-square w-full max-w-[280px] bg-white/50 dark:bg-white/10 relative overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 backdrop-blur-sm shadow-sm">
                          <img src="/images/Rectangle 71.png" alt="Hypebae Press" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-serif font-black text-3xl uppercase tracking-tighter text-[#1a1a1a] dark:text-white mb-4">HYPEBAE</h3>
                      <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
                          "On top of its affordable pricing, <strong className="font-bold text-[#AB462F]">MIA</strong> is loved for its easy-to-wear and highly pigmented formulas."
                      </p>
                  </div>

              </div>
          </div>
      </div>
    </section>
)

export default function BeautyLanding() {
  const { toast } = useToast()
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDropOpen, setIsDropOpen] = useState(false)

  const addToCart = (item: any) => {
    addItem({
      id: item.id ? item.id.toString() : `temp-${item.name}`,
      name: item.name,
      price: item.price,
      variant: item.variant ? item.variant.name : item.shade,
      image: item.variant ? item.variant.image : item.image
    })
    toast({ title: "ADDED TO BAG", description: `${item.name} - ₱${item.price}`, duration: 2000 })
  }

  const handleOpenProductModal = (product: Product) => {
      if(isDropOpen) setIsDropOpen(false)
      setTimeout(() => setSelectedProduct(product), 100)
  }

  const handleShopNow = () => {
    router.push('/shop#lips')
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans selection:bg-[#AB462F] selection:text-white">
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />

      <HeroSection onOpenProduct={handleOpenProductModal} />

      <div className="bg-[#AB462F] text-white text-[10px] md:text-xs font-bold py-3 overflow-hidden whitespace-nowrap relative flex items-center shadow-lg mb-12">
        <div className="inline-flex animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-12 tracking-[0.2em] uppercase flex items-center gap-4">
               Vegan & Cruelty Free <span className="w-1 h-1 bg-white rounded-full"/> 
               Clean Ingredients <span className="w-1 h-1 bg-white rounded-full"/> 
               Free Shipping Over ₱1,500
            </span>
          ))}
        </div>
      </div>

      <CategoryGrid />
      <ShadeCollection />
      <ShopTheLookSection onOpenModal={handleOpenProductModal} />
      <SkinBanner onShopNow={handleShopNow} />
      
      {/* MODIFIED: Changed wrapper background to transparent. The inner PressSection still uses a semi-transparent background for contrast. */}
      <div className="w-full bg-transparent dark:bg-transparent relative">
          <PressSection />
          {/* Subtle separator using a textured border effect */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-800 to-transparent my-10" />
      </div>
      
    </div>
  )
}