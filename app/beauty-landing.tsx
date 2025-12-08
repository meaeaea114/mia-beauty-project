"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

// UI Component Imports
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/app/context/cart-context"
import { ProductModal } from "@/components/shop/product-modal"
import type { Product } from "@/app/shop/page" 

// --- Mock Data for "The Drop" (Synced with Shop Page) ---
const DROP_ITEMS: Product[] = [
  {
    id: "drop-1",
    name: "Staygloss",
    tagline: "a longwear high-shine lip gloss",
    price: 395,
    // Updated Image
    image: "/images/Rectangle 141.png", 
    colors: ["#A81C26", "#B55A55"],
    variants: [
        { name: "Sizzle", color: "#A81C26", image: "/images/Rectangle 87.png" },
        { name: "Glaze", color: "#B55A55", image: "/images/Rectangle 87.png" }
    ],
    whatItIs: "A high-shine, longwear lip gloss that coats the lips in bold, vibrant color.",
    whyWeLoveIt: "It’s the gloss that lasts. Enjoy all-day color, shine, and hydration—without the stickiness.",
    claims: ["12-hour wear", "High-Shine", "Transfer-resistant"],
    reviews: 540,
    rating: 4.9
  },
  {
    id: "drop-2",
    name: "Cloud Bullet", 
    tagline: "a weightless modern matte lipstick",
    price: 495,
    // Updated Image
    image: "/images/Rectangle 131.png", 
    colors: ["#B55A55", "#D67F68", "#E8A69D", "#A81C26"],
    variants: [
      { name: "Girl Crush", color: "#B55A55", image: "/images/Rectangle 129.png" },
      { name: "Vacay", color: "#D67F68", image: "/images/Rectangle 129.png" },
      { name: "Milkshake", color: "#E8A69D", image: "/images/Rectangle 129.png" },
      { name: "Major", color: "#A81C26", image: "/images/Rectangle 129.png" }
    ],
    whatItIs: "A modern matte lipstick reinvented for everyday wear.",
    whyWeLoveIt: "Each shade melts into the lips with a velvety finish that never feels heavy.",
    claims: ["Non-drying", "High impact color", "Paraben-free"],
    reviews: 3200,
    rating: 4.9
  },
  {
    id: "drop-3",
    name: "Eyeshadow palette",
    tagline: "Effortless shades that enhance your natural look",
    price: 400,
    // Updated Image
    image: "/images/Rectangle 144-6.png",
    colors: ["#A88B7D"],
    variants: [
        { name: "Day", color: "#A88B7D", image: "/images/eyes.jpg" }
    ],
    whatItIs: "A four-shade eyeshadow palette with versatile tones.",
    whyWeLoveIt: "Enriched with Vitamin E for hydration and comfort.",
    claims: ["Easy blend", "Long wear"],
    reviews: 180,
    rating: 4.5
  },
  {
    id: "drop-4",
    name: "Lash Seeker",
    tagline: "a 12-hour wear waterproof micromascara",
    price: 359,
    // Updated Image
    image: "/images/Rectangle 146-2.png", 
    colors: ["#1A1A1A"],
    variants: [
        { name: "Black", color: "#1A1A1A", image: "/images/eyes.jpg" }
    ],
    whatItIs: "A waterproof mascara with 12-hour wear and a tiny-but-mighty wand.",
    whyWeLoveIt: "The precision brush makes defining your lashes super simple.",
    claims: ["Waterproof", "Lengthening", "Smudge-proof"],
    reviews: 450,
    rating: 4.8
  }
]

// --- Other Data ---
const STAYGLOSS_VARIANTS = [
  { id: 101, formula: "Chiffon", shade: "carnation pink", price: 395, image: "./images/Rectangle 87.png" },
  { id: 102, formula: "Cashmere", shade: "dusty pink", price: 395, image: "./images/Rectangle 91.png" },
  { id: 103, formula: "Suede", shade: "toasty nude", price: 395, image: "./images/Rectangle 99.png" },
  { id: 104, formula: "Silk", shade: "mauve nude", price: 395, image: "./images/Rectangle 93.png" },
  { id: 105, formula: "Satin", shade: "peachy rose", price: 395, image: "./images/Rectangle 99.png" },
  { id: 106, formula: "Velvet", shade: "berry mauve", price: 395, image: "./images/Rectangle 97.png" },
  { id: 107, formula: "Rouge", shade: "rosy pink", price: 395, image: "./images/Rectangle 101.png" },
];

// --- 2. COMPONENTS: INVISIBLE HOTSPOT (REVEAL ON IMAGE HOVER) ---
const Hotspot = ({ 
  top, left, label, onClick, align = "right" 
}: { 
  top: string, left: string, label: string, onClick?: () => void, align?: "left" | "right" | "top" 
}) => {
  return (
    <div 
        onClick={(e) => {
            e.stopPropagation(); 
            if (onClick) onClick();
        }}
        // Opacity transition for hover effect
        className="absolute z-50 w-12 h-12 cursor-pointer group/spot -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 ease-in-out" 
        style={{ top, left }}
    >
        {/* Aesthetic Dot: Glassy, minimalist */}
        <div className="relative flex items-center justify-center">
            {/* Core Dot */}
            <div className="w-2.5 h-2.5 bg-white/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm z-20 transition-all duration-500 ease-out group-hover/spot:bg-white group-hover/spot:scale-110 group-hover/spot:shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            
            {/* Subtle Hover Ring */}
            <div className="absolute w-8 h-8 rounded-full border border-white/30 scale-0 opacity-0 group-hover/spot:scale-100 group-hover/spot:opacity-100 transition-all duration-700 ease-out" />
        </div>

        {/* Label - Reveals on individual spot hover */}
        <div className={`
           absolute pointer-events-none opacity-0 group-hover/spot:opacity-100 transition-all duration-500 ease-out z-10
           ${align === "left" ? "right-4 flex flex-row-reverse items-center pr-2" : ""}
           ${align === "right" ? "left-4 flex flex-row items-center pl-2" : ""}
           ${align === "top" ? "bottom-4 flex flex-col-reverse items-center pb-2" : ""}
        `}>
           <div className={`bg-white/80 shadow-[0_0_2px_rgba(255,255,255,0.5)] transition-all duration-500 ease-out ${align === 'top' ? 'h-0 group-hover/spot:h-8 w-[1px]' : 'w-0 group-hover/spot:w-8 h-[1px]'}`}></div>
           <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black bg-white/95 px-3 py-2 backdrop-blur-xl shadow-xl ml-0 whitespace-nowrap translate-y-1 opacity-0 group-hover/spot:translate-y-0 group-hover/spot:opacity-100 transition-all duration-500 delay-75">
             {label}
           </span>
        </div>
    </div>
  )
}

// --- 3. COMPONENT: HERO SECTION ---
const HeroSection = ({ onOpenProduct }: { onOpenProduct: (product: Product) => void }) => {
  
  // UPDATED HERO_PRODUCTS with full shade lists from Shop page
  const HERO_PRODUCTS: Product[] = [
      { 
        id: "l6", 
        name: "Staygloss", 
        tagline: "High-shine longwear lip gloss", 
        price: 595, 
        image: "/images/Rectangle 141.png", 
        colors: ["#A81C26", "#B55A55"], 
        variants: [
            { name: "Sizzle", color: "#A81C26", image: "/images/Rectangle 141.png" },
            { name: "Glaze", color: "#B55A55", image: "/images/Rectangle 141.png" }
        ],
        whatItIs: "A high-shine, longwear lip gloss that coats the lips in bold, vibrant color with just one swipe.",
        whyWeLoveIt: "It’s the gloss that lasts and the comfort you didn’t expect. This advanced, transfer-resistant formula glides effortlessly.",
        claims: ["12-hour wear", "Budgeproof", "High-Shine", "All day comfort"],
        reviews: 540, 
        rating: 4.9 
      },
      { 
        id: "c5", 
        name: "Glow On", 
        tagline: "Light catching liquid highlighter", 
        price: 359, 
        image: "/images/Rectangle 145-1.png", 
        colors: ["#E8DCCA", "#E3C9B0", "#D67F68"],
        variants: [
            { name: "Champagne", color: "#E8DCCA", image: "/images/Rectangle 145-1.png" },
            { name: "Gold", color: "#E3C9B0", image: "/images/Rectangle 145-1.png" },
            { name: "Bronze", color: "#D67F68", image: "/images/Rectangle 145-1.png" }
        ],
        weight: "40 g / 1.4 oz",
        whatItIs: "A lightweight liquid highlighter that nourishes the skin while delivering a soft, ethereal glow.",
        whyWeLoveIt: "The silky gel formula glides smoothly and builds to your preferred intensity. Light-reflecting superfine pigments give a luminous, refined glow without glitter.",
        claims: ["Long lasting", "Paraben Free", "Buildable", "Cruelty Free"],
        reviews: 410, 
        rating: 4.6 
      }, 
      { 
        id: "b1", 
        name: "Grooming Gel", 
        tagline: "Effortless sculpting gel", 
        price: 389, 
        image: "/images/Rectangle 144-7.png", 
        colors: ["#5D4037", "#262626"], 
        variants: [
            { name: "Brown", color: "#5D4037", image: "/images/Rectangle 144-7.png" }, 
            { name: "Black", color: "#262626", image: "/images/Rectangle 144-7.png" }
        ],
        weight: "4.5 g / 0.16 oz",
        whatItIs: "A long-wearing grooming gel that shapes and sets your brows with ease.",
        whyWeLoveIt: "The wax-gel hybrid formula tints, lifts, and adds fullness for effortlessly polished brows. With all-day hold and a precise spoolie.",
        claims: ["Long wear", "Smudge-proof", "Cruelty free", "Water-resistant"],
        reviews: 890, 
        rating: 4.7 
      }
  ];

  return (
      <section className="relative w-full min-h-screen flex flex-col md:flex-row bg-[#EBE7E0] overflow-hidden">
        
        {/* LEFT SIDE: Text Content */}
        <div className="w-full md:w-[55%] flex flex-col justify-center px-6 md:px-20 lg:px-24 py-20 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-[1px] w-12 bg-[#AB462F]"></div>
                 <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#AB462F]">The New Standard</p>
              </div>
              <div className="relative mb-8 select-none">
                <h1 className="text-[14vw] md:text-[9rem] lg:text-[11rem] leading-[0.8] font-black tracking-tighter text-transparent uppercase"
                    style={{ WebkitTextStroke: "1px #2D2420" }}>
                    Stay
                </h1>
                <h1 className="text-[14vw] md:text-[9rem] lg:text-[11rem] leading-[0.8] font-black tracking-tighter text-[#2D2420] uppercase ml-2 md:ml-4 -mt-2 md:-mt-6 drop-shadow-xl">
                    Gloss
                </h1>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                  <p className="text-[#5A4D45] text-base md:text-lg leading-relaxed font-light max-w-sm border-l border-stone-300 pl-6">
                      High-shine finish. Zero stickiness. <br/>
                      The gloss that changes everything.
                  </p>
                  <Button 
                      onClick={() => onOpenProduct(HERO_PRODUCTS[0])} // Opens Staygloss
                      className="h-14 w-fit px-10 rounded-full bg-[#2D2420] text-[#F2EEE9] hover:bg-[#AB462F] hover:scale-105 font-bold tracking-[0.2em] uppercase text-[10px] shadow-2xl transition-all duration-500 ease-out"
                  >
                      Shop Now
                  </Button>
              </div>
            </motion.div>
        </div>

        {/* RIGHT SIDE: Image */}
        <div className="w-full md:w-[50%] absolute right-0 top-0 bottom-0 h-full z-10">
             {/* Added group/image to trigger hotspot visibility on hover */}
             <div className="relative w-full h-full group/image">
                 <img 
                   src="/images/image 17.png" 
                   alt="Mia Beauty Hero"
                   className="w-full h-full object-cover object-[25%_20%]" 
                 />
                 <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-[#EBE7E0] to-transparent pointer-events-none" />
                 <div className="absolute inset-0 z-40">
                     {/* BROWS - Grooming Gel (Upper Right of eyebrow) - MOVED UP */}
                     <div className="absolute" style={{ top: '28%', left: '38%' }}>
                        <Hotspot top="0%" left="0%" label="GROOMING GEL - BROWN" onClick={() => onOpenProduct(HERO_PRODUCTS[2])} align="right" />
                     </div>
                     
                     {/* CHEEKS - Glow On */}
                     <div className="absolute" style={{ top: '48%', left: '43%' }}>
                        <Hotspot top="0%" left="0%" label="GLOW ON - CHAMPAGNE" onClick={() => onOpenProduct(HERO_PRODUCTS[1])} align="left" />
                     </div>
                     
                     {/* LIPS - STAYGLOSS */}
                     <div className="absolute" style={{ top: '60%', left: '33%' }}>
                        <Hotspot top="0%" left="0%" label="STAYGLOSS - SIZZLE" onClick={() => onOpenProduct(HERO_PRODUCTS[0])} align="right" />
                     </div>
                 </div>
             </div>
        </div>
      </section>
  )
}

// --- 4. COMPONENT: SHOP THE LOOK ---
const ShopTheLookSection = ({ onOpenModal }: { onOpenModal: (item: Product) => void }) => {
    const LOOK_PRODUCTS: Product[] = [
      { 
        id: "look-tint", 
        name: "Tinted Moisturizer", 
        tagline: "oil-free tint", 
        price: 430, 
        image: "/images/Rectangle 147.png", 
        colors: ["#EBEBEB"], 
        variants: [{ name: "Porcelain", color: "#EBEBEB", image: "/images/Rectangle 68.png" }],
        weight: "30 ml",
        whatItIs: "An oil-free tinted moisturizer with SPF 20+ broad-spectrum UVA/UVB protection. Its creamy-jelly formula provides buildable light-to-medium coverage with a natural, blurred matte finish.",
        whyWeLoveIt: "Blends effortlessly for an even, healthy-looking complexion while offering 95% sun protection. Made with 75% naturally derived ingredients, it hydrates, smooths, and improves skin over time.",
        reviews: 820, 
        rating: 4.8 
      },
      { 
        id: "look-blush", 
        name: "Blush On", 
        tagline: "long-wearing cheek pigment", 
        price: 359, 
        image: "/images/Rectangle 146.png", 
        colors: ["#C67D6F", "#F28C98", "#F49F86"],
        variants: [
            { name: "Sunset", color: "#C67D6F", image: "/images/Rectangle 146.png" },
            { name: "Petal", color: "#F28C98", image: "/images/Rectangle 146.png" },
            { name: "Coral", color: "#F49F86", image: "/images/Rectangle 146.png" }
        ],
        weight: "40 g / 1.4 oz",
        whatItIs: "A long-lasting liquid blush with rich pigment that melts seamlessly into the skin. Its silky serum tint formula melts into the skin and sets for lasting color.",
        whyWeLoveIt: "Blush On delivers a weightless, fresh flush without the heaviness. It builds beautifully, leaving cheeks radiant and flawless from morning to night.",
        claims: ["Long lasting", "Buildable + Blendable", "Fragrance Free"],
        reviews: 670, 
        rating: 4.9 
      },
      { 
        id: "look-brow", 
        name: "Grooming Gel", 
        tagline: "grooming gel", 
        price: 389, 
        image: "/images/Rectangle 144-7.png",
        colors: ["#5D4037", "#262626"], 
        variants: [
            { name: "Brown", color: "#5D4037", image: "/images/Rectangle 144-7.png" },
            { name: "Black", color: "#262626", image: "/images/Rectangle 144-7.png" }
        ],
        weight: "4.5 g / 0.16 oz",
        whatItIs: "A long-wearing grooming gel that shapes and sets your brows with ease.",
        whyWeLoveIt: "The wax-gel hybrid formula tints, lifts, and adds fullness for effortlessly polished brows. With all-day hold and a precise spoolie.",
        claims: ["Long wear", "Smudge-proof", "Cruelty free"],
        reviews: 890, 
        rating: 4.7 
      },
      { 
        id: "look-lip", 
        name: "Fluffmatte", 
        tagline: "matte lipstick", 
        price: 399, 
        image: "/images/Rectangle 131.png", 
        colors: ["#B55A55", "#D67F68", "#E8A69D", "#A81C26", "#944E45"], 
        variants: [
          { name: "Girl Crush", color: "#B55A55", image: "/images/Rectangle 129.png" },
          { name: "Vacay", color: "#D67F68", image: "/images/Rectangle 129.png" },
          { name: "Milkshake", color: "#E8A69D", image: "/images/Rectangle 129.png" },
          { name: "Major", color: "#A81C26", image: "/images/Rectangle 129.png" },
          { name: "Baked", color: "#944E45", image: "/images/Rectangle 129.png" }
        ],
        weight: "3.2 g / 0.11 oz",
        whatItIs: "A modern matte lipstick reinvented for everyday wear. Fluffmatte glides on effortlessly, delivering smooth, even pigment with a second-skin feel.",
        whyWeLoveIt: "Fluffmatte comes in curated shades designed to complement a wide range of undertones. Each shade melts into the lips with a velvety finish.",
        claims: ["Paraben-free", "Non-drying", "High impact color", "Fragrance-free"],
        reviews: 3200, 
        rating: 4.9 
      },
    ];
    
    return (
        <section className="w-full py-24 px-4 md:px-8 bg-white/40 dark:bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-5 space-y-10">
                    <div className="space-y-2">
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#AB462F] dark:text-[#E8A69D]">Editorial</span>
                      <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none text-foreground">Shop<br/>The Look</h2>
                      <p className="text-sm text-stone-500 italic">Tip: Hover over the model to see the products.</p>
                    </div>
                    <div className="space-y-6">
                        {LOOK_PRODUCTS.map((product) => (
                            <div key={product.id} className="flex gap-6 items-start group cursor-pointer" onClick={() => onOpenModal(product)}>
                                <div className="h-24 w-24 bg-[#E9E4D9] dark:bg-white/10 shrink-0 border border-stone-100 dark:border-white/10 p-2 flex items-center justify-center">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg uppercase tracking-tight text-foreground group-hover:text-[#AB462F] transition-colors">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{product.tagline}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="font-semibold text-sm text-foreground">₱{product.price}</span>
                                        <button className="text-[10px] font-bold uppercase tracking-widest border-b border-foreground text-foreground hover:text-[#AB462F] hover:border-[#AB462F] transition-colors pb-0.5">Add to Bag</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="md:col-span-7 h-full relative group/image">
                  <div className="relative aspect-[3/4] w-full h-full bg-stone-200 dark:bg-stone-800 overflow-hidden shadow-2xl rounded-sm">
                      <img src="/images/shop-look-portrait.jpg" alt="Shop the look model" className="w-full h-full object-cover object-center transition-all duration-1000" />
                      <div className="absolute inset-0">
                          {/* LIPS: 64% Top - FLUFFMATTE (Girl Crush) */}
                          <div className="absolute" style={{ top: '64%', left: '50%' }}>
                             <Hotspot top="0%" left="0%" label="FLUFFMATTE - GIRL CRUSH" onClick={() => onOpenModal(LOOK_PRODUCTS[3])} align="right" />
                          </div>
                          {/* CHEEKS: 53% Top - BLUSH ON (Petal) */}
                          <div className="absolute" style={{ top: '53%', left: '30%' }}>
                             <Hotspot top="0%" left="0%" label="BLUSH ON - PETAL" onClick={() => onOpenModal(LOOK_PRODUCTS[1])} align="left" />
                          </div>
                          {/* BROWS: 32% Top - GROOMING GEL (Brown) */}
                          <div className="absolute" style={{ top: '32%', left: '29%' }}>
                             <Hotspot top="0%" left="0%" label="GROOMING GEL - BROWN" onClick={() => onOpenModal(LOOK_PRODUCTS[2])} align="right" />
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </section>
    );
};

// --- 5. COMPONENT: STAYGLOSS COLLECTION ---
const StayglossCollection = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
    const router = useRouter()
    return (
        <section className="w-full pt-20 pb-16 bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-8 mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                <div><h2 className="text-5xl font-black tracking-tighter uppercase mb-2 text-foreground">Staygloss</h2></div>
                <div className="hidden md:block pb-2"><span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Swipe to explore →</span></div>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 md:space-x-8 pb-8 px-4 md:px-8 no-scrollbar scroll-smooth"> 
                {STAYGLOSS_VARIANTS.map((gloss) => (
                    <div key={gloss.id} className="w-[200px] md:w-[240px] flex-shrink-0 snap-center group">
                         <div className="aspect-[4/5] w-full bg-white/80 dark:bg-white/10 relative overflow-hidden mb-4 border border-stone-100 dark:border-white/10 cursor-pointer" onClick={() => router.push('/shop#lips')}>
                            <img src={gloss.image} alt={gloss.shade} className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base uppercase tracking-tight text-foreground">Staygloss</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">{gloss.shade}</p>
                            <Button size="sm" className="w-full rounded-full h-8 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background hover:bg-[#AB462F] hover:text-white transition-colors border border-transparent" onClick={() => onAddToCart({ name: "Staygloss", ...gloss })}>Add to Bag</Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- 6. OTHER COMPONENTS ---
const PressSection = () => (
    <section className="w-full py-24 px-4 md:px-8 border-t border-black/5 dark:border-white/5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {["Rectangle 72.png", "Rectangle 73.png", "Rectangle 71.png"].map((img, i) => (
             <Link key={i} href="/shop#lips" className="flex flex-col items-center group cursor-pointer">
                <div className="aspect-square w-full max-w-[280px] bg-white/50 dark:bg-white/10 relative overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 backdrop-blur-sm shadow-sm">
                    <img src={`/images/${img}`} alt="Press" className="w-full h-full object-cover" />
                </div>
             </Link>
          ))}
      </div>
    </section>
)

const CategoryGrid = () => (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-0.5 bg-transparent">
        {[
            {name:"Lips",img:"/images/lips.jpg"}, {name:"Brows",img:"/images/brows.jpg"},
            {name:"Eyes",img:"/images/eyes.jpg"}, {name:"Cheeks",img:"/images/cheeks.jpg"},
            {name:"Face",img:"/images/Rectangle 80.png"}
        ].map((cat, index) => (
          <Link key={index} href={`/shop#${cat.name.toLowerCase()}`} className="relative aspect-[3/4] group cursor-pointer overflow-hidden block">
            <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                 <span className="text-white font-black text-2xl uppercase tracking-tighter drop-shadow-md">{cat.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
)

const SkinBanner = ({ onShopNow }: { onShopNow: () => void }) => (
    <section className="py-20 px-4 md:px-8 bg-transparent">
        <div className="container mx-auto">
            <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-[#E8E6E1] dark:bg-stone-900 shadow-2xl">
                <video autoPlay loop muted playsInline src="/vid/Makeup_Tutorial_Video_Creation.mp4" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black/20 dark:bg-black/40">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
                      <h2 className="text-6xl md:text-9xl font-black text-white leading-none mb-8 drop-shadow-xl uppercase tracking-tighter">The <span className="font-serif italic font-normal lowercase tracking-normal">perfect</span> <br /> Lip.</h2>
                      <Button size="lg" className="h-14 rounded-full bg-white text-black border-none px-10 font-bold tracking-[0.2em] uppercase hover:bg-[#AB462F] hover:text-white transition-all shadow-xl hover:scale-105" onClick={onShopNow}>Shop Lips</Button>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);

// --- 7. MAIN EXPORT ---
export default function BeautyLanding() {
  const { toast } = useToast()
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDropOpen, setIsDropOpen] = useState(false)

  const addToCart = (item: any) => {
    addItem({
      id: item.id || `temp-${item.name}`,
      name: item.name,
      price: item.price,
      variant: item.variant ? item.variant.name : item.shade,
      image: item.variant ? item.variant.image : item.image
    })

    toast({
      title: "ADDED TO BAG",
      description: `${item.name} - ₱${item.price}`,
      duration: 2000,
    })
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

      {/* Marquee Banner */}
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
      <StayglossCollection onAddToCart={addToCart} />
      <ShopTheLookSection onOpenModal={handleOpenProductModal} />
      <SkinBanner onShopNow={handleShopNow} />
      <PressSection />
    </div>
  )
}