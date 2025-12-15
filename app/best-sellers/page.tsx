"use client"

import * as React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ProductModal } from "@/components/shop/product-modal"
import { useCart } from "@/app/context/cart-context"
import { Star, Loader2, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

// --- Types (Synced with Shop Page) ---
export type Product = {
  id: string
  name: string
  tagline: string
  price: number
  image: string
  variants?: {
    name: string
    color: string
    image: string
  }[] 
  colors: string[] 
  
  weight?: string
  whatItIs?: string
  whyWeLoveIt?: string
  howItFeels?: string
  theLook?: string
  skincare?: string
  claims?: string[]
  reviews?: number
  rating?: number
  category?: string
  whatMakesItSoGood?: string
}

// --- STATIC BEST SELLERS DATA (Top 8 by Reviews) ---
const BEST_SELLERS: Product[] = [
  { 
    id: "l1", 
    name: "Fluffmatte", 
    tagline: "Weightless modern matte lipstick", 
    price: 399, 
    image: "/images/Rectangle 131.png", 
    colors: ["#B55A55", "#D67F68", "#E8A69D", "#A81C26", "#944E45"],
    variants: [
      { name: "Girl Crush", color: "#B55A55", image: "/images/Girl Crush.png" },
      { name: "Brunette", color: "#D67F68", image: "/images/Brunette.png" },
      { name: "Nudist", color: "#E8A69D", image: "/images/Nudist.png" },
      { name: "Casual", color: "#A81C26", image: "/images/Casual.png" },
      { name: "Baked", color: "#944E45", image: "/images/Baked.png" }
    ],
    weight: "3.2 g / 0.11 oz",
    whatItIs: "A modern matte lipstick reinvented for everyday wear. Fluffmatte glides on effortlessly, delivering smooth, even pigment with a second-skin feel.",
    whyWeLoveIt: "Fluffmatte comes in 7 curated shades — a versatile lineup of flattering mauves, neutrals, and bold tones designed to complement a wide range of undertones. Each shade melts into the lips with a velvety finish that never feels heavy. Our soft-focus formula cushions the lips, offering comfortable wear that blurs lines and leaves a plush, diffused look all day.",
    claims: ["Easy to use", "Paraben-free", "Non-drying", "Cruelty-free", "High impact color", "Fragrance-free"],
    reviews: 3200,
    rating: 4.9,
    category: "Lips"
  },
  { 
    id: "c1", 
    name: "Airblush", 
    tagline: "Soft-focus sheer cheek tint", 
    price: 359, 
    image: "/images/Rectangle 157.png", 
    colors: ["#F28C98"],
    variants: [
        { name: "Doll", color: "#F28C98", image: "/images/Rectangle 150.png" }
    ],
    weight: "2.5 g / 0.09 oz",
    whatItIs: "A soft-focus cheek tint that delivers a subtle, blurred matte flush for effortlessly polished skin.",
    whyWeLoveIt: "Airblush’s cream-to-powder formula blends seamlessly for a naturally soft, airbrushed look. This universally flattering shade enhances any complexion with a perfect, soft flush.",
    claims: ["Blendable", "Paraben free", "Buildable", "Cruelty Free", "Easy-to-use", "Fragrance free"],
    reviews: 1540,
    rating: 4.8,
    category: "Cheeks"
  },
  { 
    id: "l5", 
    name: "Lip Dip", 
    tagline: "Whipped matte lip cream", 
    price: 299, 
    image: "/images/Rectangle 129-1.png", 
    colors: ["#944E45", "#B55A55", "#A81C26"],
    variants: [
        { name: "Nonchalant", color: "#944E45", image: "/images/Nonchalant.png" },
        { name: "Nougat", color: "#B55A55", image: "/images/Nougat.png" },
        { name: "Dragon", color: "#A81C26", image: "/images/Dragon.png" }
    ],
    weight: "3g / 0.11oz",
    whatItIs: "A blurred matte lip tint that gives your lips a soft, long-lasting wash of color.",
    whyWeLoveIt: "Lip Dip glides effortlessly, softening the look of imperfections while smoothing and plumping lips for a naturally fuller appearance. Its blurred matte finish is perfect for everyday wear, leaving a true-to-color tint that stays on for hours.",
    claims: ["Soft-matte blurred finish", "Lightweight and silky texture", "Non-drying formula", "Powered with Airblur Technology", "Fragrance-free", "True-to-color tint that lasts"],
    reviews: 1200,
    rating: 4.8,
    category: "Lips"
  },
  { 
    id: "f4", 
    name: "Sun Safe", 
    tagline: "Invisible SPF 50+ serum", 
    price: 350, 
    image: "/images/Rectangle 145-3.png", 
    colors: ["#E3C9B0"],
    variants: [
        { name: "Invisible", color: "#E3C9B0", image: "/images/Rectangle 145-3.png" }
    ],
    weight: "80 g / 50 ml",
    whatItIs: "A lightweight, invisible SPF 50+ PA+++ sunscreen in a serum gel texture. No white cast, no heaviness—just all-day sun protection.",
    whyWeLoveIt: "Infused with niacinamide, peptides, vitamin E, and photoceramides, it protects, hydrates, and nourishes the skin, offering a lightweight, invisible barrier against UV damage while supporting a healthy, radiant complexion.",
    claims: ["Sunscreen and serum", "Fast absorbing", "Dermatologically tested", "Clean and vegan", "Lightweight", "Fragrance free"],
    reviews: 950,
    rating: 5.0,
    category: "Skin"
  },
  { 
    id: "l2", 
    name: "Fluffbalm", 
    tagline: "Moisturizing matte blotted lipstick", 
    price: 399, 
    image: "/images/Rectangle 131.png", 
    colors: ["#D88A7A", "#C27970", "#B55A55"],
    variants: [
      { name: "Perfect Nude", color: "#D88A7A", image: "/images/PERFECT NUDE.png" },
      { name: "Perfect Pink", color: "#C27970", image: "/images/PERFECT PINK.png" },
      { name: "Perfect Mauve", color: "#B55A55", image: "/images/PERFECT MAUVE.png" }
    ],
    weight: "3.2 g / 0.11 oz",
    whatItIs: "A moisturizing, buildable lipstick with a weightless finish, designed to give lips a soft, cloud-like diffused effect.",
    whyWeLoveIt: "Fluffbalm effortlessly provides the coveted blotted lip look in just one swipe, perfect for an everyday minimalist vibe. The unique creamy formula applies like a lipstick but feels as comfortable as your favorite lip balm, preventing dryness. It comes in three effortlessly wearable shades—the perfect nude, a perfect pink, and a perfect mauve—to deliver a subtle pop of color.",
    claims: ["Sheer and lightweight", "Paraben free", "Soft blurred finish", "Cruelty free", "Moisturizing matte", "Fragrance free"],
    reviews: 890,
    rating: 4.7,
    category: "Lips"
  },
  { 
    id: "b1", 
    name: "Grooming Gel", 
    tagline: "Effortless sculpting gel", 
    price: 389, 
    image: "/images/Rectangle 144-7.png", 
    colors: ["#5D4037"],
    variants: [
        { name: "Brown", color: "#5D4037", image: "/images/brows.jpg" }
    ],
    weight: "4.5 g / 0.16 oz",
    whatItIs: "A long-wearing grooming gel that shapes and sets your brows with ease.",
    whyWeLoveIt: "The wax-gel hybrid formula tints, lifts, and adds fullness for effortlessly polished brows. With all-day hold and a precise spoolie, simply brush upward to achieve a soft, feathered finish that stays in place.",
    claims: ["Long wear", "Paraben free", "Smudge-proof", "Cruelty free", "Water-resistant", "Fragrance free"],
    reviews: 890,
    rating: 4.7,
    category: "Brows"
  },
  { 
    id: "f1", 
    name: "Tinted Moisturizer", 
    tagline: "Oil-free base", 
    price: 430, 
    image: "/images/Rectangle 147.png", 
    colors: ["#EBEBEB"],
    variants: [
        { name: "Porcelain", color: "#EBEBEB", image: "/images/Rectangle 68.png" }
    ],
    weight: "30 ml",
    whatItIs: "An oil-free tinted moisturizer with SPF 20+ broad-spectrum UVA/UVB protection. Its creamy-jelly formula provides buildable light-to-medium coverage with a natural, blurred matte finish. Enhanced by oil-absorbing powders to keep skin fresh all day.",
    whyWeLoveIt: "Blends effortlessly for an even, healthy-looking complexion while offering 95% sun protection. Made with 75% naturally derived ingredients, it hydrates, smooths, and improves skin over time. Dermatologically approved and safe for sensitive skin, it’s the ultimate everyday essential.",
    reviews: 820,
    rating: 4.8,
    category: "Face"
  },
  { 
    id: "c3", 
    name: "Blush On", 
    tagline: "Long-wearing cheek pigment", 
    price: 359, 
    image: "/images/Rectangle 146.png", 
    colors: ["#C67D6F", "#F28C98", "#F49F86"],
    variants: [
        { name: "Sunset", color: "#C67D6F", image: "/images/Image 12-2-25 at 12.32 PM.jpeg" },
        { name: "Petal", color: "#F28C98", image: "/images/Image 12-2-25 at 12.35 PM.jpeg" },
        { name: "Coral", color: "#F49F86", image: "/images/Image 12-2-25 at 12.28 PM (1).jpeg" }
    ],
    weight: "40 g / 1.4 oz",
    whatItIs: "A long-lasting liquid blush with rich pigment that melts seamlessly into the skin. Its silky serum tint formula melts into the skin and sets for lasting color. Enriched with our signature Radiant Blend of flower-powered ingredients, it soothes, hydrates, and nourishes.",
    whyWeLoveIt: "Blush On delivers a weightless, fresh flush without the heaviness. It builds beautifully, leaving cheeks radiant and flawless from morning to night.",
    claims: ["Long lasting", "Paraben Free", "Buildable + Blendable", "Cruelty Free", "Easy to use", "Fragrance Free"],
    reviews: 670,
    rating: 4.9,
    category: "Cheeks"
  }
]

// --- BEST SELLER CARD (Aesthetic Matches Shop) ---
const BestSellerCard = ({ product, ranking, onClick, onAdd }: { product: Product, ranking: number, onClick: () => void, onAdd: (p: Product) => void }) => {
  const [activeImage, setActiveImage] = useState(product.image);
  
  // Auto-select first variant image if available
  useEffect(() => {
     if(product.variants && product.variants.length > 0) {
         setActiveImage(product.variants[0].image);
     } else {
         setActiveImage(product.image);
     }
  }, [product]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: ranking * 0.1 }} // Staggered animation
      className="flex flex-col group cursor-pointer items-center text-center"
      onClick={onClick}
    >
      {/* UNIQUE SHAPE: Rounded Arch Top */}
      <div className="relative w-full aspect-[3/4.2] overflow-hidden mb-6 rounded-t-[40px] rounded-b-[12px] bg-[#EFECE5] dark:bg-white/5 backdrop-blur-sm shadow-sm group-hover:shadow-xl transition-all duration-500 ease-out border border-white/40 dark:border-white/10">
        
        {/* Ranking Badge */}
        <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-[#AB462F] text-white flex items-center justify-center font-black text-xs shadow-lg ring-2 ring-white/20">
            #{ranking}
        </div>

        {/* Main Image */}
        <img 
          src={activeImage} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
           <Button 
             className="w-full h-11 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] bg-white/95 backdrop-blur text-black hover:bg-[#AB462F] hover:text-white border border-stone-200 shadow-xl transition-all" 
             onClick={(e) => {
               e.stopPropagation();
               onAdd(product);
             }}
           >
             Add to Bag — ₱{product.price}
           </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 items-center w-full px-2">
        <h3 className="font-black text-lg uppercase tracking-tight text-foreground leading-none group-hover:text-[#AB462F] transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium tracking-wide line-clamp-1 italic font-serif">
          {product.tagline}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1 bg-stone-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
             <div className="flex text-[#AB462F] gap-[1px]">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={10}
                        className={`fill-current ${i < Math.floor(product.rating || 5) ? "" : "opacity-30"}`} 
                    />
                ))}
             </div>
             <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold">
                ({product.reviews || 0})
             </span>
        </div>
      </div>
    </motion.div>
  )
}

function BestSellersContent() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: defaultVariant ? defaultVariant.image : product.image,
        variant: defaultVariant ? defaultVariant.name : "Standard",
    })
    toast({
      title: "ADDED TO BAG",
      description: `${product.name} - ₱${product.price}`,
      duration: 1500,
    })
  }
  
  const handleOpenModal = (product: Product) => {
      setSelectedProduct(product)
  }

  return (
    <div className="w-full min-h-screen font-sans selection:bg-[#AB462F] selection:text-white pt-28 pb-32 transition-all duration-700 bg-transparent">
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />

      <div className="container mx-auto px-6 md:px-12">
        
        {/* --- HERO HEADER --- */}
        <div className="relative rounded-[40px] 
            bg-[#EFECE5] dark:bg-white/5 
            border border-white/60 dark:border-white/10 
            overflow-hidden mb-24 shadow-sm"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 p-8 md:p-16">
                <div className="text-left space-y-6">
                    <div className="flex items-center gap-3 text-[#AB462F]">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">The Icons</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-[#1a1a1a] dark:text-white uppercase tracking-tighter leading-[0.85]">
                        Best<br/>Sellers
                    </h1>
                    
                    <p className="text-stone-600 dark:text-stone-300 text-sm md:text-lg font-medium leading-relaxed max-w-sm">
                        The products you can't stop talking about. <br/>
                        Rated 4.8+ stars by our community.
                    </p>
                </div>

                {/* Hero Video */}
                <div className="h-[300px] md:h-[400px] w-full relative rounded-3xl overflow-hidden shadow-lg border border-white/20">
                     <video 
                        src="/vid/Makeup_Tutorial_Video_Creation.mp4" 
                        autoPlay loop muted playsInline 
                        className="w-full h-full object-cover grayscale-[10%]" 
                     />
                </div>
            </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-20 px-2">
            {BEST_SELLERS.map((product, index) => (
                <BestSellerCard 
                    key={product.id}
                    ranking={index + 1}
                    product={product} 
                    onAdd={handleAddToCart}
                    onClick={() => handleOpenModal(product)} 
                />
            ))}
        </div>

      </div>
    </div>
  )
}

export default function BestSellersPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#AB462F]" />
        </div>
    }>
      <BestSellersContent />
    </Suspense>
  )
}