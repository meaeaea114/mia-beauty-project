"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog" // Ensure DialogTitle is imported for accessibility
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, Zap, Star, Check, Droplets, Sparkles, Feather } from "lucide-react"
import { useCart } from "@/app/context/cart-context"
import type { Product } from "@/app/shop/page"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

// Helper to get icons based on claim text (optional visual flair)
const getClaimIcon = (claim: string) => {
  const lower = claim.toLowerCase()
  if (lower.includes("water") || lower.includes("hydrat")) return <Droplets className="w-3 h-3" />
  if (lower.includes("light") || lower.includes("weight")) return <Feather className="w-3 h-3" />
  if (lower.includes("shine") || lower.includes("glow")) return <Sparkles className="w-3 h-3" />
  if (lower.includes("easy")) return <Zap className="w-3 h-3" />
  return <Check className="w-3 h-3" />
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  
  // State for the currently displayed image & selected variant
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedVariantName, setSelectedVariantName] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  // Reset state when the product changes
  useEffect(() => {
    if (product) {
      setQuantity(1)
      // Default to the first variant's image if available, otherwise main image
      const defaultVariant = product.variants?.[0]
      setSelectedImage(defaultVariant?.image || product.image)
      setSelectedVariantName(defaultVariant?.name || "Standard")
      setSelectedColor(defaultVariant?.color || product.colors?.[0] || "")
    }
  }, [product])

  if (!product) return null

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      variant: selectedVariantName,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${isOpen ? "animate-in fade-in duration-200" : "hidden"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Modal Card */}
        <div className="relative w-full max-w-4xl bg-[#FDFCFA] dark:bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
          
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>

          {/* LEFT: Image Section */}
          <div className="w-full md:w-1/2 bg-[#F0EBE6] dark:bg-stone-800 flex items-center justify-center p-8 relative">
             <div className="relative aspect-square w-full max-w-[350px]">
                <img 
                  src={selectedImage} 
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-opacity duration-300"
                />
             </div>
          </div>

          {/* RIGHT: Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto bg-[#FDFCFA] dark:bg-[#1a1a1a]">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-1 text-[#1a1a1a] dark:text-white">{product.name}</h2>
              <p className="text-stone-500 text-sm font-medium uppercase tracking-wide">{product.tagline}</p>
              {product.weight && (
                <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">{product.weight}</p>
              )}
            </div>

            {/* Dynamic Claims Grid */}
            {product.claims && product.claims.length > 0 && (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-8 text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400">
                 {product.claims.map((claim, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <span className="text-[#AB462F]">{getClaimIcon(claim)}</span>
                     <span>{claim}</span>
                   </div>
                 ))}
              </div>
            )}

            {/* Description (Why We Love It) */}
            <div className="space-y-4 mb-8">
               <h3 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white border-b border-stone-100 pb-2">Why We Love It</h3>
               <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-light">
                 {product.whyWeLoveIt || product.whatItIs || "Experience the perfect balance of color and care."}
               </p>
               
               {/* Reviews */}
               <div className="flex items-center gap-2 mt-4">
                  <div className="flex text-[#E6C25F]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "fill-current" : "opacity-30"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    {product.reviews ? `${product.reviews} Reviews` : "New Arrival"}
                  </span>
               </div>
            </div>

            <div className="mt-auto space-y-6">
                {/* --- SHADE SELECTION --- */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Select Shade</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#AB462F]">{selectedVariantName}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                              setSelectedImage(variant.image)
                              setSelectedVariantName(variant.name)
                              setSelectedColor(variant.color)
                          }}
                          className={`w-10 h-10 rounded-full transition-all duration-200 shadow-sm ${
                            selectedVariantName === variant.name 
                              ? "ring-2 ring-[#AB462F] ring-offset-2 scale-110" 
                              : "hover:scale-110 hover:ring-1 hover:ring-stone-300"
                          }`}
                          style={{ backgroundColor: variant.color }}
                          title={variant.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <hr className="border-stone-200 dark:border-stone-800" />

                {/* Footer Actions */}
                <div className="flex items-center gap-4">
                   {/* Quantity */}
                   <div className="flex items-center justify-between border border-stone-300 dark:border-stone-700 rounded-full h-14 w-36 px-5">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="hover:text-[#AB462F] transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-base font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="hover:text-[#AB462F] transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>

                   {/* Add Button */}
                   <Button 
                     onClick={handleAddToCart}
                     className="flex-1 h-14 rounded-full bg-white border border-stone-900 text-black font-bold tracking-[0.2em] uppercase text-xs hover:bg-stone-900 hover:text-white transition-all flex justify-between px-8 items-center shadow-none hover:shadow-lg"
                   >
                     <span className="font-bold text-sm">₱{product.price * quantity}</span>
                     <span>Add to Bag</span>
                   </Button>
                </div>
            </div>

          </div>
        </div>
      </div>
    </Dialog>
  )
}