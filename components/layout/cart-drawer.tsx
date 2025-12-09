"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { X, Plus, Minus, ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/cart-context"
import { useRouter } from "next/navigation"

// Types for local XML lookup
type ProductVariant = {
  name: string
  color: string
  image: string
}

type ProductRec = {
  id: string
  name: string
  tagline: string
  price: number
  originalPrice: number
  image: string
  variant: string
  category: string
}

// --- POOL OF POTENTIAL RECOMMENDATIONS ---
const RECOMMENDATION_POOL: ProductRec[] = [
  { 
    id: "f7", 
    name: "The Blotting Powder", 
    tagline: "Oil-absorbing sheer powder", 
    price: 499, 
    originalPrice: 795,
    image: "/images/Rectangle 144-2.png", 
    variant: "Translucent",
    category: "Face"
  },
  { 
    id: "l4", 
    name: "Juicetint", 
    tagline: "Hydrating soft lip tint", 
    price: 299, 
    originalPrice: 0,
    image: "/images/Rectangle 134.png", 
    variant: "Strawberry",
    category: "Lips"
  },
  { 
    id: "c1", 
    name: "Airblush", 
    tagline: "Soft-focus sheer cheek tint", 
    price: 359, 
    originalPrice: 0,
    image: "/images/Rectangle 157.png", 
    variant: "Doll",
    category: "Cheeks"
  },
  { 
    id: "e4", 
    name: "Lash Seeker", 
    tagline: "12-hour wear waterproof mascara", 
    price: 359, 
    originalPrice: 499,
    image: "/images/Rectangle 146-2.png", 
    variant: "Black",
    category: "Eyes"
  },
  {
    id: "b1",
    name: "Grooming Gel",
    tagline: "Effortless sculpting gel",
    price: 389,
    originalPrice: 0,
    image: "/images/Rectangle 144-7.png",
    variant: "Brown",
    category: "Brows"
  }
]

export function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    removeItem, 
    updateQuantity, 
    updateVariant, 
    subtotal,
    addItem
  } = useCart()
  
  const router = useRouter()
  const [productDb, setProductDb] = useState<Record<string, ProductVariant[]>>({})
  
  // --- RECOMMENDATION LOGIC ---
  const recommendation = useMemo(() => {
    const hasFace = items.some(i => i.id.startsWith('f') || i.id.startsWith('s')) 
    const hasLips = items.some(i => i.id.startsWith('l'))
    const hasCheeks = items.some(i => i.id.startsWith('c'))
    const hasEyes = items.some(i => i.id.startsWith('e'))
    const hasBrows = items.some(i => i.id.startsWith('b'))

    let candidateId = ""

    if (!hasFace) candidateId = "f7"
    else if (!hasLips) candidateId = "l4"
    else if (!hasCheeks) candidateId = "c1"
    else if (!hasEyes) candidateId = "e4"
    else if (!hasBrows) candidateId = "b1"
    else candidateId = "f7" 

    let candidate = RECOMMENDATION_POOL.find(p => p.id === candidateId)

    if (candidate && items.some(i => i.id === candidate.id)) {
        candidate = RECOMMENDATION_POOL.find(rec => !items.some(item => item.id === rec.id))
    }

    return candidate || null
  }, [items])


  // Fetch XML Data for Edit Shade Dropdown
  useEffect(() => {
    async function loadProductData() {
      try {
        const res = await fetch('/products.xml')
        const text = await res.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, "text/xml")
        
        const db: Record<string, ProductVariant[]> = {}
        
        Array.from(doc.getElementsByTagName("product")).forEach(node => {
           const id = node.getAttribute("id") || ""
           const mainImage = node.getElementsByTagName("image")[0]?.textContent || ""
           
           const variants = Array.from(node.getElementsByTagName("variant")).map(v => ({
              name: v.textContent || "Standard",
              color: v.getAttribute("color") || "#000",
              image: mainImage
           }))
           
           if(id) db[id] = variants
        })
        setProductDb(db)
      } catch (e) {
        console.error("Error loading XML for cart", e)
      }
    }
    
    if (isCartOpen) {
      loadProductData()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isCartOpen])

  // Logic for Free Shipping Progress
  const FREE_SHIPPING_THRESHOLD = 1500
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  
  if (!isCartOpen) return null

  // --- CHECKOUT HANDLER ---
  const handleCheckout = () => {
      setIsCartOpen(false)
      router.push('/checkout')
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end font-sans text-[#1a1a1a]">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel - FORCED LIGHT THEME */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-white">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">Your Bag ({items.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="hover:opacity-50 transition-opacity">
            <X className="w-5 h-5 text-[#1a1a1a]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
           {items.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 px-10">
                <p className="text-sm text-stone-500">Your bag is currently empty.</p>
                <Button variant="outline" onClick={() => { setIsCartOpen(false); router.push("/shop"); }} className="uppercase text-xs font-bold tracking-widest border-black text-black hover:bg-black hover:text-white">
                    Start Shopping
                </Button>
             </div>
           ) : (
             <div className="p-6 space-y-2 bg-white min-h-[40vh]">
               {items.map((item) => {
                 const availableVariants = productDb[item.id] || []
                 
                 return (
                   <div key={`${item.id}-${item.variant}`} className="flex gap-0 bg-[#F9F9F9] p-4 mb-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 shrink-0 flex items-center justify-center bg-white mix-blend-multiply">
                         <img src={item.image || "/images/placeholder.jpg"} alt={item.name} className="w-full h-full object-contain p-2" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 pl-5 flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-bold text-[#1a1a1a] mb-0.5">{item.name}</h3>
                                {/* Variant Selector */}
                                <div className="relative inline-block">
                                    {availableVariants.length > 1 ? (
                                        <div className="inline-block relative group cursor-pointer">
                                            <select 
                                                className="appearance-none bg-transparent pr-4 py-0 text-sm text-stone-500 italic cursor-pointer focus:outline-none hover:text-[#AB462F] transition-colors w-full"
                                                value={item.variant || ""}
                                                onChange={(e) => {
                                                    const newV = availableVariants.find(v => v.name === e.target.value)
                                                    if (newV) updateVariant(item.id, item.variant || "", newV)
                                                }}
                                            >
                                                {availableVariants.map(v => (
                                                    <option key={v.name} value={v.name}>{v.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-stone-500 italic">{item.variant}</p>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm font-bold text-[#1a1a1a]">₱{item.price.toLocaleString()}</span>
                         </div>

                         {/* Controls */}
                         <div className="flex justify-between items-end mt-4">
                            <button 
                                onClick={() => removeItem(item.id, item.variant)}
                                className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-[#AB462F] underline decoration-stone-300 underline-offset-4 transition-colors"
                            >
                                Remove
                            </button>

                            {/* Quantity Box */}
                            <div className="flex items-center border border-stone-300 bg-white h-8 w-24">
                               <button 
                                 onClick={() => updateQuantity(item.id, item.variant, -1)}
                                 className="w-8 h-full flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                               >
                                 <Minus className="w-3 h-3" />
                               </button>
                               <span className="flex-1 text-center text-sm font-medium text-[#1a1a1a]">{item.quantity}</span>
                               <button 
                                 onClick={() => updateQuantity(item.id, item.variant, 1)}
                                 className="w-8 h-full flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                               >
                                 <Plus className="w-3 h-3" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                 )
               })}
             </div>
           )}

           {/* --- DYNAMIC RECOMMENDED PAIRING --- */}
           {items.length > 0 && recommendation && (
               <div className="px-6 pb-6 bg-white">
                   <h4 className="text-sm text-[#1a1a1a] mb-4 font-normal">Recommended pairing</h4>
                   
                   <div className="flex gap-5 items-center bg-[#F9F9F9] p-5">
                       {/* Rec Image */}
                       <div className="w-20 h-20 shrink-0 flex items-center justify-center bg-white mix-blend-multiply">
                           <img src={recommendation.image} className="w-full h-full object-contain p-2" alt={recommendation.name} />
                       </div>
                       
                       {/* Rec Details */}
                       <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-[#1a1a1a] leading-tight">{recommendation.name}</p>
                           <p className="text-xs text-stone-500 mb-2 mt-1 leading-snug line-clamp-2">{recommendation.tagline}</p>
                           
                           <div className="flex items-center justify-between mt-3">
                               <div className="flex items-center gap-2">
                                   {recommendation.originalPrice > 0 && (
                                       <span className="text-xs font-medium text-stone-400 line-through">₱{recommendation.originalPrice}</span>
                                   )}
                                   <span className="text-sm font-bold text-[#1a1a1a]">₱{recommendation.price}</span>
                               </div>
                               
                               <button 
                                   className="text-[10px] font-bold uppercase tracking-widest border border-[#1a1a1a] px-3 py-1.5 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all"
                                   onClick={() => addItem({ 
                                       id: recommendation.id, 
                                       name: recommendation.name, 
                                       price: recommendation.price, 
                                       image: recommendation.image, 
                                       variant: recommendation.variant 
                                   })}
                               >
                                   Add to Bag
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-stone-100">
           <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#1a1a1a]">Subtotal</span>
              <span className="text-base font-bold text-[#1a1a1a]">₱{subtotal.toLocaleString()} PHP</span>
           </div>

           {/* Free Shipping Text */}
           <div className="mb-6 text-center">
              <p className="text-xs italic text-stone-500">
                 {remainingForFreeShip > 0 
                    ? <><span className="font-bold font-serif text-[#1a1a1a]">₱{remainingForFreeShip.toLocaleString()}</span> away from FREE shipping!</>
                    : "You've unlocked FREE shipping!"}
              </p>
           </div>

           <Button 
                onClick={handleCheckout} // Added the navigation handler
                className="w-full h-12 rounded-full bg-white text-[#1a1a1a] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-none"
                disabled={items.length === 0}
           >
              Checkout
           </Button>
        </div>

      </div>
    </div>
  )
}