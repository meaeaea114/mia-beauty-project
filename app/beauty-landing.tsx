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

// --- Components ---

const PressSection = () => {
  return (
    <section className="w-full py-24 px-4 md:px-8 border-t border-black/5 dark:border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          
          {/* Allure - Linked to Lips */}
          <Link href="/shop#lips" className="flex flex-col items-center group cursor-pointer">
            <div className="aspect-square w-full max-w-[280px] bg-white/50 dark:bg-white/10 relative overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 backdrop-blur-sm shadow-sm">
                <img src="/images/Rectangle 72.png" alt="Lipstick Swatches" className="w-full h-full object-cover" />
            </div>
            <div className="text-center flex flex-col items-center max-w-[260px]">
              <h3 className="text-xl font-serif italic mb-3 text-foreground group-hover:text-[#AB462F] transition-colors">Allure</h3>
              <p className="text-[11px] font-medium tracking-widest leading-relaxed uppercase text-muted-foreground">
                &quot;MIA makes just one lipstick and it&apos;s constantly selling out.&quot;
              </p>
            </div>
          </Link>

          {/* Nylon - Linked to Lips */}
          <Link href="/shop#lips" className="flex flex-col items-center group cursor-pointer">
            <div className="aspect-square w-full max-w-[280px] bg-white/50 dark:bg-white/10 relative overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 backdrop-blur-sm shadow-sm">
                <img src="/images/Rectangle 73.png" alt="Lipstick Tube" className="w-full h-full object-cover" />
            </div>
            <div className="text-center flex flex-col items-center max-w-[260px]">
              <h3 className="text-xl font-serif italic mb-3 text-foreground group-hover:text-[#AB462F] transition-colors">Nylon</h3>
              <p className="text-[11px] font-medium tracking-widest leading-relaxed uppercase text-muted-foreground">
                &quot;Sold out within 10 minutes.&quot;
              </p>
            </div>
          </Link>

          {/* Hypebae - Linked to Lips */}
          <Link href="/shop#lips" className="flex flex-col items-center group cursor-pointer">
            <div className="aspect-square w-full max-w-[280px] bg-white/50 dark:bg-white/10 relative overflow-hidden mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 backdrop-blur-sm shadow-sm">
                <img src="/images/Rectangle 71.png" alt="Lipstick Collection" className="w-full h-full object-cover" />
            </div>
            <div className="text-center flex flex-col items-center max-w-[260px]">
              <h3 className="text-xl font-serif italic mb-3 text-foreground group-hover:text-[#AB462F] transition-colors">Hypebae</h3>
              <p className="text-[11px] font-medium tracking-widest leading-relaxed uppercase text-muted-foreground">
                &quot;Loved for its easy-to-wear and highly pigmented formulas.&quot;
              </p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}

const CategoryGrid = () => {
  const categories = [
    { name: "Lips", image: "./images/lips.jpg", href: "/shop#lips" },
    { name: "Brows", image: "./images/brows.jpg", href: "/shop#brows" },
    { name: "Eyes", image: "./images/eyes.jpg", href: "/shop#eyes" },
    { name: "Cheeks", image: "./images/cheeks.jpg", href: "/shop#cheeks" },
    { name: "Face", image: "./images/Rectangle 80.png", href: "/shop#face" },
  ]

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-0.5 bg-transparent">
        {categories.map((cat, index) => (
          <Link 
            key={index} 
            href={cat.href} 
            className="relative aspect-[3/4] group cursor-pointer overflow-hidden block"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                 <span className="text-white font-black text-2xl uppercase tracking-tighter drop-shadow-md">{cat.name}</span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-6 flex justify-center z-10 md:hidden">
              <div className="bg-white/90 dark:bg-black/60 backdrop-blur text-black dark:text-white px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase">
                {cat.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

const StayglossCollection = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
    const router = useRouter()

    return (
        <section className="w-full pt-20 pb-16 bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-8 mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase mb-2 text-foreground">Staygloss</h2>
                  <p className="text-lg text-muted-foreground font-normal">All the shades in a weightless formula.</p>
                </div>
                <div className="hidden md:block pb-2">
                   <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Swipe to explore →</span>
                </div>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 md:space-x-8 pb-8 px-4 md:px-8 no-scrollbar scroll-smooth"> 
                {STAYGLOSS_VARIANTS.map((gloss) => (
                    <div 
                        key={gloss.id} 
                        className="w-[200px] md:w-[240px] flex-shrink-0 snap-center group"
                    >
                         <div 
                            className="aspect-[4/5] w-full bg-white/80 dark:bg-white/10 relative overflow-hidden mb-4 border border-stone-100 dark:border-white/10 cursor-pointer"
                            onClick={() => router.push('/shop#lips')}
                        >
                            <img 
                                src={gloss.image} 
                                alt={`Staygloss ${gloss.shade}`}
                                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="text-left">
                            <div className="flex justify-between items-baseline mb-1">
                              <p className="font-bold text-base uppercase tracking-tight text-foreground">Staygloss</p>
                              <span className="text-sm font-semibold text-foreground">₱{gloss.price}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">{gloss.shade}</p>
                            
                            <Button 
                                size="sm" 
                                className="w-full rounded-full h-8 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background hover:bg-[#AB462F] hover:text-white transition-colors border border-transparent"
                                onClick={() => onAddToCart({ name: "Staygloss", ...gloss })}
                            >
                                Add to Bag
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- SHOP THE LOOK SECTION ---
const ShopTheLookSection = ({ onOpenModal }: { onOpenModal: (item: Product) => void }) => {
    // These now use the VALID image paths from Shop Page
    const LOOK_PRODUCTS: Product[] = [
      { 
        id: "look-tint", 
        name: "Tinted Moisturizer", 
        tagline: "an oil-free tinted moisturizer", 
        price: 430, 
        // Updated Image
        image: "/images/Rectangle 147.png", 
        colors: ["#EBEBEB"],
        variants: [
            // Updated Image in Variant too
            { name: "Porcelain", color: "#EBEBEB", image: "/images/Rectangle 147.png" }
        ],
        whatItIs: "An oil-free tinted moisturizer with SPF 20+ broad-spectrum UVA/UVB protection. Its creamy-jelly formula provides buildable light-to-medium coverage with a natural, blurred matte finish.",
        whyWeLoveIt: "Blends effortlessly for an even, healthy-looking complexion while offering 95% sun protection. Made with 75% naturally derived ingredients, it hydrates, smooths, and improves skin over time.",
        claims: ["Oil-free", "SPF 20+", "Buildable coverage", "Safe for sensitive skin"],
        reviews: 820,
        rating: 4.8
      },
      { 
        id: "look-petal", 
        name: "Petal Stain", 
        tagline: "lip and cheek stain", 
        price: 549, 
        // Updated Image (Used Juicetint as base since it fits the 'Stain' profile)
        image: "/images/Rectangle 134.png", 
        colors: ["#C27970", "#D67F68", "#E8A69D", "#A81C26", "#944E45", "#B55A55"],
        variants: [
            // Using placeholder swatch images, or map to specific ones if you have them
            { name: "Bitten", color: "#C27970", image: "/images/Rectangle 93.png" },
            { name: "Peach", color: "#D67F68", image: "/images/Rectangle 93.png" },
            { name: "Rosy", color: "#E8A69D", image: "/images/Rectangle 93.png" },
            { name: "Ruby", color: "#A81C26", image: "/images/Rectangle 93.png" },
            { name: "Terra", color: "#944E45", image: "/images/Rectangle 93.png" },
            { name: "Mauve", color: "#B55A55", image: "/images/Rectangle 93.png" }
        ],
        whatItIs: "A multi-use stain for lips and cheeks that gives a natural, long-lasting flush.",
        whyWeLoveIt: "It keeps your lips hydrated and comfortable while giving you buildable color. Enriched with skin-loving ingredients to keep lips smooth and soft.",
        claims: ["Long-wearing", "Multi-use", "Blendable", "Hydrating"],
        reviews: 170,
        rating: 4.8
      },
    ];
    
    return (
        <section className="w-full py-24 px-4 md:px-8 bg-white/40 dark:bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-5 space-y-10">
                    <div className="space-y-2">
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#AB462F] dark:text-[#E8A69D]">Editorial</span>
                      <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none text-foreground">
                          Shop<br/>The Look
                      </h2>
                    </div>

                    <div className="space-y-6">
                        {LOOK_PRODUCTS.map((product) => (
                            <div 
                                key={product.id} 
                                className="flex gap-6 items-start group cursor-pointer"
                                onClick={() => onOpenModal(product)} 
                            >
                                <div className="h-24 w-24 bg-[#E9E4D9] dark:bg-white/10 shrink-0 border border-stone-100 dark:border-white/10 p-2 flex items-center justify-center">
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg uppercase tracking-tight text-foreground group-hover:text-[#AB462F] transition-colors">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{product.tagline}</p>
                                    
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="flex gap-1 mb-2">
                                            {product.variants.map((v, i) => (
                                                <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="font-semibold text-sm text-foreground">₱{product.price}</span>
                                        <button 
                                            className="text-[10px] font-bold uppercase tracking-widest border-b border-foreground text-foreground hover:text-[#AB462F] hover:border-[#AB462F] transition-colors pb-0.5"
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                onOpenModal(product);
                                            }}
                                        >
                                            Add to Bag
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-7 h-full">
                  <div className="relative aspect-[3/4] w-full h-full bg-stone-200 dark:bg-stone-800 overflow-hidden shadow-2xl">
                      <img 
                          src="/images/Rectangle 67.png" 
                          alt="Shop the look model"
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                  </div>
                </div>
            </div>
        </section>
    );
};

// --- UPDATED SKIN BANNER ---
const SkinBanner = ({ onShopNow }: { onShopNow: () => void }) => {
    return (
        <section className="py-20 px-4 md:px-8 bg-transparent">
            <div className="container mx-auto">
                <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-[#E8E6E1] dark:bg-stone-900 shadow-2xl">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        src="/vid/Makeup_Tutorial_Video_Creation.mp4" 
                        poster="/images/skin-banner-product-focus.jpg"
                        className="absolute inset-0 w-full h-full object-cover opacity-90" 
                    >
                        Your browser does not support the video tag.
                    </video>
                    {/* Darker overlay for better text readability */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black/20 dark:bg-black/40">
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="max-w-4xl"
                        >
                          {/* Updated Headline regarding Lips */}
                          <h2 className="text-6xl md:text-9xl font-black text-white leading-none mb-8 drop-shadow-xl uppercase tracking-tighter">
                              The <span className="font-serif italic font-normal lowercase tracking-normal">perfect</span> <br /> 
                              Lip.
                          </h2>
                          <Button
                              size="lg"
                              className="h-14 rounded-full bg-white text-black border-none px-10 font-bold tracking-[0.2em] uppercase hover:bg-[#AB462F] hover:text-white transition-all shadow-xl hover:scale-105"
                              onClick={onShopNow}
                          >
                              Shop Lips
                          </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default function BeautyLanding() {
  const { toast } = useToast()
  const router = useRouter()
  const { addItem } = useCart()
  
  // State for Product Modal and Drop Modal
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
      description: `${item.name} ${item.variant?.name ? `(${item.variant.name})` : ''} - ₱${item.price}`,
      duration: 2000,
    })
  }

  // Opens the Product Modal (with full shade selection)
  const handleOpenProductModal = (product: Product) => {
      if(isDropOpen) setIsDropOpen(false)
      setTimeout(() => setSelectedProduct(product), 100)
  }

  const handleShopNow = () => {
    router.push('/shop#lips')
  }

  const handleShopAll = () => {
    router.push('/shop')
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans selection:bg-[#AB462F] selection:text-white">
      
      {/* Product Modal */}
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />

      {/* --- Shop The Drop Modal Overlay --- */}
      <AnimatePresence>
        {isDropOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDropOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[1200px] md:max-w-[90vw] top-[10%] md:top-[15%] z-50 bg-[#EBE9E4] dark:bg-[#1a1a1a] shadow-2xl overflow-y-auto max-h-[85vh] md:max-h-auto p-10 md:p-16 md:rounded-none border border-white/20"
            >
               <button onClick={() => setIsDropOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-stone-600 dark:text-stone-300" />
               </button>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {DROP_ITEMS.map((item) => (
                    <div 
                      key={item.id} 
                      className="group bg-[#FDFCFA] dark:bg-white/5 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => handleOpenProductModal(item)}
                    >
                       <div className="aspect-square w-full mb-6 relative bg-transparent flex items-center justify-center overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700 p-4"
                          />
                       </div>
                       
                       <div className="flex flex-col flex-grow w-full border-t border-stone-100 dark:border-white/10 pt-5 mt-auto">
                           <h3 className="font-bold text-base uppercase tracking-widest mb-2 text-stone-900 dark:text-white">{item.name}</h3>
                           <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight max-w-[180px] mx-auto font-medium">
                             {item.tagline}
                           </p>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[90vh] overflow-hidden">
        <img 
          src="./images/image 17.png" 
          alt="Hero background image"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /> 
        <div className="relative h-full container mx-auto flex flex-col justify-end pb-24 px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/90 mb-4 border-l-2 border-[#AB462F] pl-4">The New Standard</p>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase mb-6 leading-[0.85] text-white">
              Stay <br/><span className="text-white/50 stroke-white">Gloss</span>
            </h1>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <p className="max-w-md text-white/90 text-lg leading-relaxed font-light">
                High-shine finish. Zero stickiness. The gloss that changes how you see gloss.
              </p>
              <Button 
                onClick={() => setIsDropOpen(true)}
                className="rounded-full h-12 px-10 text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-[#AB462F] hover:text-white border-none transition-colors"
              >
                Shop The Drop
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- MARQUEE BAR --- */}
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