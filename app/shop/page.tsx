"use client"

import * as React from "react"
import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ProductModal } from "@/components/shop/product-modal"
import { useCart } from "@/app/context/cart-context"
import { Search, X, Star, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
// Removed unused ShareButtons import from here since it's now in the Modal

// --- Types ---
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
}

// MODIFIED: Added 'items: Product[]' to Category type to fix TS errors
type Category = {
  title: string
  description: string
  media: string
  mediaType: 'video' | 'image'
  items: Product[] 
}

// --- Media Mapping ---
const CATEGORY_MEDIA_MAP: Record<string, { media: string, type: 'video' | 'image' }> = {
  "LIPS": { media: "/vid/Makeup_Tutorial_Video_Creation.mp4", type: "video" },
  "CHEEKS": { media: "/vid/d0b8a7b6-8549-46e5-a790-b30ffe3c0782.mp4", type: "video" },
  "FACE": { media: "/vid/Tinted_Moisturizer_Commercial_Video_Creation.mp4", type: "video" },
  "EYES": { media: "/vid/Girl_Applying_Mascara_Video.mp4", type: "video" },
  "BROWS": { media: "/vid/Girl_s_Eyebrow_Commercial_Video.mp4", type: "video" }
}

// --- Shop Card ---
const ShopCard = ({ product, onClick, onAdd }: { product: Product, onClick: () => void, onAdd: (p: Product) => void }) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeVariant, setActiveVariant] = useState(product.variants ? product.variants[0] : null);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col group cursor-pointer items-center text-center"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[3/4.2] overflow-hidden mb-6 rounded-t-[40px] rounded-b-[12px] bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-sm group-hover:shadow-xl transition-all duration-500 ease-out border border-white/40 dark:border-white/10">
        <img 
          src={activeImage} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
        />
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

      <div className="flex flex-col gap-2 items-center w-full px-2">
        <h3 className="font-black text-lg uppercase tracking-tight text-foreground leading-none group-hover:text-[#AB462F] transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium tracking-wide line-clamp-1 italic font-serif">
          {product.tagline}
        </p>

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

        <div className="flex justify-center gap-2 mt-1 flex-wrap h-6" onClick={(e) => e.stopPropagation()}>
          {product.variants && product.variants.length > 0 ? (
            product.variants.map((v, i) => (
              <button
                key={i}
                aria-label={`Select ${v.name}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeVariant?.name === v.name 
                    ? "scale-150 ring-1 ring-offset-2 ring-[#AB462F] dark:ring-white" 
                    : "opacity-60 hover:opacity-100 hover:scale-110"
                }`}
                style={{ backgroundColor: v.color }}
                title={v.name}
                onMouseEnter={() => {
                    setActiveImage(v.image);
                    setActiveVariant(v);
                }}
              />
            ))
          ) : (
            product.colors?.map((c, i) => (
               <div key={i} className="w-3 h-3 rounded-full border border-stone-300 dark:border-white/20" style={{ backgroundColor: c }} />
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ShopContent() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("q")

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/products.xml")
        if (!response.ok) throw new Error("Could not connect to Product Database (XML).")
        
        const text = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")
        
        const parseError = xmlDoc.getElementsByTagName("parsererror")
        if (parseError.length > 0) throw new Error("XML Database corrupted.")

        const categoryNodes = xmlDoc.getElementsByTagName("category")
        const parsedCategories: Category[] = []

        Array.from(categoryNodes).forEach(catNode => {
           const title = catNode.getAttribute("name") || "Untitled"
           const description = catNode.getAttribute("description") || ""
           
           const productNodes = catNode.getElementsByTagName("product")
           const items: Product[] = Array.from(productNodes).map(prodNode => {
              const getTag = (tag: string) => prodNode.getElementsByTagName(tag)[0]?.textContent || ""
              const variantNodes = prodNode.getElementsByTagName("variant")
              const variants = Array.from(variantNodes).map(v => ({
                  name: v.textContent || "Standard",
                  color: v.getAttribute("color") || "#000",
                  image: getTag("image")
              }))
              const colors = variants.length > 0 
                  ? variants.map(v => v.color) 
                  : Array.from(prodNode.getElementsByTagName("color")).map(c => c.textContent || "#000")

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
                 category: title
              }
           })

           const mediaInfo = CATEGORY_MEDIA_MAP[title] || { media: "/images/light_texture.jpg", type: "image" }

           parsedCategories.push({
             title,
             description,
             media: mediaInfo.media,
             mediaType: mediaInfo.type,
             items // Now included and correctly typed
           })
        })

        setCategories(parsedCategories)
        setIsLoading(false)

      } catch (err: any) {
        console.error("Database Error:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const allProducts = useMemo(() => {
    return categories.flatMap(cat => cat.items)
  }, [categories])

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return []
    const lowerQuery = searchQuery.toLowerCase().trim()
    
    if (lowerQuery.includes("best") || lowerQuery.includes("seller")) {
        return allProducts.filter(p => (p.rating || 0) >= 4.8 && (p.reviews || 0) > 500)
    }

    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.tagline.toLowerCase().includes(lowerQuery) ||
      (product.category && product.category.toLowerCase().includes(lowerQuery))
    )
  }, [searchQuery, allProducts])

  const handleClearSearch = () => {
    router.push("/shop")
  }

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

  if (isLoading) {
    return (
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-stone-50 dark:bg-black">
         <Loader2 className="h-10 w-10 animate-spin text-[#AB462F] mb-4" />
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Loading Collection...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center px-4">
         <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
         <h2 className="text-xl font-bold uppercase tracking-tight mb-2">Connection Failed</h2>
         <p className="text-stone-500 max-w-md mb-6">{error}</p>
         <Button onClick={() => window.location.reload()} variant="outline">Retry Connection</Button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen font-sans selection:bg-[#AB462F] selection:text-white pt-28 pb-32 transition-all duration-700
      bg-transparent"
    >
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />

      <div className="container mx-auto px-6 md:px-12">
        {searchQuery ? (
           <div className="min-h-[60vh]">
              <div className="flex flex-col border-b border-stone-800/10 dark:border-white/20 pb-8 mb-16 backdrop-blur-sm rounded-xl p-4">
                 <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 mb-4 block">Search Results</span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-stone-900 dark:text-white">
                        "{searchQuery}"
                        </h1>
                    </div>
                    <button 
                      onClick={handleClearSearch}
                      className="text-xs font-bold tracking-widest uppercase hover:text-[#AB462F] transition-colors mb-2 flex items-center gap-2 text-stone-600 dark:text-stone-300"
                    >
                      <X className="w-4 h-4" /> Clear Filter
                    </button>
                 </div>
              </div>

              {filteredProducts.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20">
                    {filteredProducts.map((product) => (
                      <ShopCard 
                        key={product.id} 
                        product={product} 
                        onAdd={handleAddToCart}
                        onClick={() => setSelectedProduct(product)} 
                      />
                    ))}
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-6">
                    <Search className="w-16 h-16 text-stone-300/50" />
                    <div className="space-y-2">
                        <p className="text-3xl text-stone-400 font-light">No matches found</p>
                        <p className="text-sm text-stone-500">We couldn't find any products matching "{searchQuery}".</p>
                    </div>
                    <Button variant="outline" className="rounded-full px-8 bg-white/50 backdrop-blur-md border-stone-200" onClick={handleClearSearch}>View All</Button>
                 </div>
              )}
           </div>
        ) : (
          <div className="space-y-48">
            <div className="text-center max-w-4xl mx-auto pt-10 animate-in fade-in zoom-in duration-700">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#AB462F] mb-6 block">The Catalog</span>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase mb-8 text-[#1a1a1a] dark:text-white leading-[0.8]">
                Shop All
              </h1>
              <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-xl mx-auto">
                Essentials designed for the modern muse. <br/>
                <span className="text-xs font-mono opacity-40 block mt-4 uppercase tracking-widest">Database: XML Connected</span>
              </p>
            </div>

            {categories.map((category, idx) => (
              <section key={category.title} id={category.title.toLowerCase()} className="scroll-mt-32">
                <div className="rounded-[40px] 
                  bg-white/40 dark:bg-black/40 
                  border border-white/60 dark:border-white/10 
                  backdrop-blur-xl shadow-2xl 
                  p-8 md:p-12 mb-20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className={`lg:col-span-4 ${idx % 2 === 0 ? 'order-1' : 'order-1 lg:order-2 lg:text-right'}`}>
                          <h2 className="text-6xl md:text-8xl font-black text-[#1a1a1a] dark:text-white uppercase tracking-tighter leading-[0.8] mb-6 drop-shadow-sm">
                              {category.title}
                          </h2>
                          <p className="text-stone-700 dark:text-stone-200 text-sm md:text-base font-medium leading-relaxed max-w-xs inline-block">
                              {category.description}
                          </p>
                      </div>

                      <div className={`lg:col-span-8 h-[300px] md:h-[400px] relative rounded-3xl overflow-hidden group shadow-md ${idx % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}`}>
                          {category.mediaType === 'video' ? (
                              <video 
                                  src={category.media} 
                                  autoPlay 
                                  loop 
                                  muted 
                                  playsInline 
                                  className="w-full h-full object-cover grayscale-[10%] opacity-95 transition-transform duration-[2s] group-hover:scale-105" 
                              />
                          ) : (
                              <img 
                                  src={category.media} 
                                  alt={category.title} 
                                  className="w-full h-full object-cover grayscale-[10%] opacity-95 transition-transform duration-[2s] group-hover:scale-105" 
                              />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
                      </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-20 px-2">
                  {category.items.map((product) => (
                    <ShopCard 
                      key={product.id} 
                      product={product} 
                      onAdd={handleAddToCart}
                      onClick={() => setSelectedProduct(product)} 
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-muted-foreground bg-[#FAF9F6] dark:bg-black">Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}