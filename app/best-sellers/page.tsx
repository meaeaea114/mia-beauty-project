"use client"

import * as React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ProductModal } from "@/components/shop/product-modal"
import { useCart } from "@/app/context/cart-context"
import { Star, Loader2, AlertCircle, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

// --- Types (Same as Shop) ---
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
  reviews?: number
  rating?: number
  category?: string
}

// --- UPDATED CARD AESTHETIC (Matches Shop Page) ---
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
      transition={{ duration: 0.6, ease: "easeOut", delay: ranking * 0.1 }} // Staggered animation based on rank
      className="flex flex-col group cursor-pointer items-center text-center"
      onClick={onClick}
    >
      {/* UNIQUE SHAPE: Matches Shop Page 
        rounded-t-[40px] for soft arch
      */}
      <div className="relative w-full aspect-[3/4.2] overflow-hidden mb-6 rounded-t-[40px] rounded-b-[12px] bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-sm group-hover:shadow-xl transition-all duration-500 ease-out border border-white/40 dark:border-white/10">
        
        {/* Ranking Badge (Exclusive to Best Seller Page) */}
        <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-[#AB462F] text-white flex items-center justify-center font-black text-xs shadow-lg">
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
             className="w-full h-11 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-[#AB462F] hover:text-white hover:border-[#AB462F] border border-stone-200 shadow-xl transition-all" 
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
      <div className="flex flex-col gap-2 items-center w-full px-2">
        <h3 className="font-black text-lg uppercase tracking-tight text-foreground leading-none group-hover:text-[#AB462F] transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium tracking-wide line-clamp-1 italic font-serif">
          {product.tagline}
        </p>

        {/* Static Rating */}
        <div className="flex items-center gap-1 my-1">
             <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "fill-[#AB462F] text-[#AB462F]" : "fill-transparent text-stone-300"}`} 
                    />
                ))}
             </div>
             <span className="text-[10px] text-stone-400 font-bold ml-1">
                ({product.reviews || 0})
             </span>
        </div>

        {/* Color Previews (Non-interactive here to keep it clean, or can be same as Shop) */}
        <div className="flex justify-center gap-1 mt-1 flex-wrap h-4 opacity-60">
           {product.colors?.slice(0, 5).map((c, i) => (
               <div key={i} className="w-2 h-2 rounded-full border border-stone-300 dark:border-white/20" style={{ backgroundColor: c }} />
           ))}
           {product.colors && product.colors.length > 5 && <span className="text-[9px] text-stone-400">+</span>}
        </div>
      </div>
    </motion.div>
  )
}

function BestSellersContent() {
  const { toast } = useToast()
  const { addItem } = useCart()
  // MODIFIED: State now includes rank
  const [selectedProduct, setSelectedProduct] = useState<(Product & { rank?: number }) | null>(null)
  
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- FETCH & FILTER BEST SELLERS ---
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/products.xml")
        if (!response.ok) throw new Error("Could not connect to database.")
        
        const text = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")
        
        // Helper to extract product data (Same logic as ShopPage)
        const extractProducts = (nodes: HTMLCollectionOf<Element>) => {
            return Array.from(nodes).map(prodNode => {
                const getTag = (tag: string) => prodNode.getElementsByTagName(tag)[0]?.textContent || ""
                const variantNodes = prodNode.getElementsByTagName("variant")
                const variants = Array.from(variantNodes).map(v => ({
                    name: v.textContent || "Standard",
                    color: v.getAttribute("color") || "#000",
                    image: getTag("image")
                }))
                const colors = variants.length > 0 ? variants.map(v => v.color) : Array.from(prodNode.getElementsByTagName("color")).map(c => c.textContent || "#000")

                return {
                    id: prodNode.getAttribute("id") || Math.random().toString(),
                    name: getTag("name"),
                    tagline: getTag("tagline"),
                    price: parseFloat(getTag("price")) || 0,
                    image: getTag("image"),
                    rating: parseFloat(getTag("rating")) || 5,
                    reviews: parseInt(getTag("reviews")) || 0,
                    variants: variants,
                    colors: colors,
                    category: "General"
                }
            })
        }

        // Get ALL products from all categories
        const allCategoryNodes = xmlDoc.getElementsByTagName("category")
        let allItems: Product[] = []
        Array.from(allCategoryNodes).forEach(cat => {
            const products = extractProducts(cat.getElementsByTagName("product"))
            allItems = [...allItems, ...products]
        })

        // --- LOGIC: Select products with HIGHEST Reviews ---
        // 1. Sort ALL products by review count descending.
        const topProducts = allItems
            .sort((a, b) => (b.reviews || 0) - (a.reviews || 0)) // Sort by most reviews
            .slice(0, 8) // Limit to top 8 items

        setBestSellers(topProducts)
        setIsLoading(false)

      } catch (err: any) {
        setError(err.message)
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

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
  
  // New handler to set the product AND its rank
  const handleOpenModal = (product: Product, rank: number) => {
      setSelectedProduct({ ...product, rank })
  }

  if (isLoading) return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-50 dark:bg-black">
         <Loader2 className="h-10 w-10 animate-spin text-[#AB462F] mb-4" />
      </div>
  )

  return (
    // MODIFIED: Removed explicit bg image/cover classes to rely on transparent body
    <div className="w-full min-h-screen font-sans selection:bg-[#AB462F] selection:text-white pt-28 pb-32 transition-all duration-700
      bg-transparent"
    >
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />

      <div className="container mx-auto px-6 md:px-12">
        
        {/* --- HERO HEADER (Glassmorphism) --- */}
        <div className="relative rounded-[40px] 
            bg-white/40 dark:bg-black/40 
            border border-white/60 dark:border-white/10 
            backdrop-blur-xl shadow-2xl 
            p-8 md:p-16 mb-24 overflow-hidden"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="text-left space-y-6">
                    <div className="flex items-center gap-3 text-[#AB462F]">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">The Icons</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-[#1a1a1a] dark:text-white uppercase tracking-tighter leading-[0.85] drop-shadow-sm">
                        Best<br/>Sellers
                    </h1>
                    
                    <p className="text-stone-700 dark:text-stone-200 text-sm md:text-lg font-medium leading-relaxed max-w-sm">
                        The products you can't stop talking about. <br/>
                        Rated 4.8+ stars by our community.
                    </p>
                </div>

                {/* Hero Video/Image */}
                <div className="h-[300px] md:h-[400px] w-full relative rounded-3xl overflow-hidden shadow-lg border border-white/20">
                     {/* Using the LIPS video as a generic vibrant hero, or switch to FACE */}
                     <video 
                        src="/vid/Makeup_Tutorial_Video_Creation.mp4" 
                        autoPlay loop muted playsInline 
                        className="w-full h-full object-cover grayscale-[10%]" 
                     />
                     <div className="absolute inset-0 bg-black/10" />
                </div>
            </div>
            
            {/* Decorative background blur element */}
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#AB462F]/10 rounded-full blur-[100px] -z-10" />
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20 px-2">
            {bestSellers.map((product, index) => (
                <BestSellerCard 
                    key={product.id}
                    ranking={index + 1}
                    product={product} 
                    onAdd={handleAddToCart}
                    // MODIFIED: Pass both the product and its rank
                    onClick={() => handleOpenModal(product, index + 1)} 
                />
            ))}
        </div>

        {/* --- EMPTY STATE (Just in case) --- */}
        {bestSellers.length === 0 && !error && (
            <div className="text-center py-20 text-stone-500">
                <p>No best sellers found based on current criteria.</p>
            </div>
        )}

      </div>
    </div>
  )
}

export default function BestSellersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BestSellersContent />
    </Suspense>
  )
}