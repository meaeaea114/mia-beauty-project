"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Star } from "lucide-react"
import { useCart } from "@/app/context/cart-context"
import { ProductModal } from "@/components/shop/product-modal"
import type { Product } from "@/app/shop/page" // Importing the type ensures compatibility

// --- Fully Populated Best Sellers Data ---
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
    whyWeLoveIt: "Fluffmatte comes in 7 curated shades — a versatile lineup of flattering mauves, neutrals, and bold tones designed to complement a wide range of undertones. Each shade melts into the lips with a velvety finish that never feels heavy.",
    claims: ["Easy to use", "Paraben-free", "Non-drying", "Cruelty-free", "High impact color", "Fragrance-free"],
    reviews: 3200,
    rating: 4.9
  },
  { 
    id: "c1", 
    name: "Airblush", 
    tagline: "Soft-focus sheer cheek tint", 
    price: 359, 
    image: "/images/Rectangle 157.png", 
    colors: ["#F28C98", "#F49F86", "#C67D6F"],
    variants: [
        { name: "Doll", color: "#F28C98", image: "/images/Rectangle 157.png" },
    ],
    weight: "2.5 g / 0.09 oz",
    whatItIs: "A soft-focus cheek tint that delivers a subtle, blurred matte flush for effortlessly polished skin.",
    whyWeLoveIt: "Airblush’s cream-to-powder formula blends seamlessly for a naturally soft, airbrushed look. This universally flattering shade enhances any complexion with a perfect, soft flush.",
    claims: ["Blendable", "Paraben free", "Buildable", "Cruelty Free", "Easy-to-use", "Fragrance free"],
    reviews: 1540,
    rating: 4.8
  },
  { 
    id: "f4", 
    name: "Sunsafe", 
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
    rating: 5.0
  },
  { 
    id: "l3", 
    name: "Glidegloss", 
    tagline: "Plumping high shine gloss stick", 
    price: 350, 
    image: "/images/Rectangle 133.png", 
    colors: ["#E8A69D", "#D67F68"],
    variants: [
        { name: "Gumamela", color: "#E8A69D", image: "/images/GUMAMELA.png" },
        { name: "Tart", color: "#D67F68", image: "/images/TART.png" }
    ],
    weight: "2.3 g / 0.08 oz",
    whatItIs: "A high-shine gloss stick that glides on like a balm, delivering rich pigment and an ultra-luminous finish.",
    whyWeLoveIt: "Its creamy formula melts smoothly onto the lips, giving a subtle plumping and refreshing sensation. Choose from two trend-setting, juicy shades designed to complement any look and keep your lips deeply hydrated.",
    claims: ["Gloss in a stick", "Naturally Plumping", "Non-retractable", "Ultra high shine", "Non sticky", "Moisturizing"],
    reviews: 820,
    rating: 4.7
  },
  { 
    id: "f3", 
    name: "Dream Cream", 
    tagline: "Supercharged hydrating serum", 
    price: 500, 
    image: "/images/Rectangle 144-3.png", 
    colors: ["#FDF3E3"],
    variants: [
        { name: "Standard", color: "#FDF3E3", image: "/images/Rectangle 144-3.png" }
    ],
    weight: "140 g / 50 ml",
    whatItIs: "A serum gel cream that instantly hydrates and revitalizes the skin, leaving a luminous, healthy glow.",
    whyWeLoveIt: "Dream Cream combines hyaluronic acid and ceramides to lock in moisture and reinforce the skin barrier. Infused with niacinamide and powerful antioxidants, it brightens, protects, and nourishes the skin, delivering a luxurious, all-in-one hydration experience.",
    claims: ["Hydrate up to 72 hours", "Paraben free", "Safe for sensitive skin", "Cruelty free", "Non-comedogenic", "Fragrance-free"],
    reviews: 450,
    rating: 5.0
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
    whyWeLoveIt: "The wax-gel hybrid formula tints, lifts, and adds fullness for effortlessly polished brows. With all-day hold and a precise spoolie, simply brush upward to achieve a soft, feathered finish that stays in place.",
    claims: ["Long wear", "Paraben free", "Smudge-proof", "Cruelty free", "Water-resistant", "Fragrance free"],
    reviews: 890,
    rating: 4.7
  },
]

// --- Card Component ---
const ProductCard = ({ product, onAdd, onClick }: { product: Product, onAdd: (p: Product) => void, onClick: () => void }) => {
  return (
    <div 
      className="flex flex-col group relative cursor-pointer" 
      onClick={onClick} // Open modal on card click
    >
      {/* Badge */}
      <div className="absolute top-2 left-2 z-10 bg-[#AB462F] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
        Best Seller
      </div>

      {/* Image */}
      <div className="relative aspect-[4/5] bg-white/50 dark:bg-black/20 overflow-hidden mb-3 border border-transparent hover:border-stone-200 dark:hover:border-white/10 transition-colors">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        {/* Desktop Quick Add */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block bg-white/90 dark:bg-black/80 backdrop-blur-sm">
           <Button 
             className="w-full h-9 rounded-full text-xs font-bold uppercase tracking-wider" 
             onClick={(e) => {
               e.stopPropagation(); // Prevent modal opening
               onAdd(product);
             }}
           >
             Add - ₱{product.price}
           </Button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base uppercase tracking-tight text-foreground">{product.name}</h3>
          <span className="text-sm font-semibold text-foreground">₱{product.price}</span>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
           <div className="flex text-[#AB462F]">
             {[...Array(5)].map((_, i) => (
               <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "fill-current" : "opacity-30"}`} />
             ))}
           </div>
           <span>({product.reviews})</span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>
        
        {/* Colors/Variants */}
        <div className="flex gap-1 mt-1 h-3">
          {product.variants ? (
             product.variants.map((v, i) => (
               <div key={i} className="w-3 h-3 rounded-full border border-stone-200 dark:border-white/20" style={{ backgroundColor: v.color }} />
             ))
          ) : (
             product.colors?.map((c, i) => (
               <div key={i} className="w-3 h-3 rounded-full border border-stone-200 dark:border-white/20" style={{ backgroundColor: c }} />
             ))
          )}
        </div>

        {/* Mobile Add */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 md:hidden rounded-full text-[10px] font-bold uppercase"
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal opening
            onAdd(product);
          }}
        >
          Add to Bag
        </Button>
      </div>
    </div>
  )
}

export default function BestSellersPage() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const addToCart = (product: Product) => {
    // Default to first variant if available
    const defaultVariant = product.variants ? product.variants[0] : null;

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

  return (
    <div className="w-full bg-transparent text-foreground font-sans selection:bg-[#AB462F] selection:text-white pt-24 pb-20">
      
      {/* Product Modal */}
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />

      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#AB462F] mb-3 block">Customer Favorites</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 text-foreground">
            Best Sellers
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            The products you can't get enough of. Restocked and ready for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {BEST_SELLERS.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={addToCart} 
                  onClick={() => setSelectedProduct(product)} 
                />
            ))}
        </div>

      </div>
    </div>
  )
}