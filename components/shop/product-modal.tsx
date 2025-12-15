"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { X, Star, Check, Minus, Plus, ShoppingBag, Droplets, Sparkles, Heart, Info, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/app/shop/page"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  
  // State for selections
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<{ name: string, color: string, image: string } | null>(null)
  
  // Initialize state when product opens
  useEffect(() => {
    if (product) {
      setQuantity(1)
      // Default to first variant if exists
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0])
      } else {
        setSelectedVariant(null)
      }
    }
  }, [product, isOpen])

  // Determine current display image
  const activeImage = selectedVariant ? selectedVariant.image : product?.image

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: activeImage || product.image,
      variant: selectedVariant ? selectedVariant.name : "Standard",
      quantity: quantity,
    })

    toast({
      title: "ADDED TO BAG",
      description: `${quantity}x ${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''}`,
      duration: 2000,
    })
    
    onClose()
  }

  if (!isOpen || !product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 transition-all duration-300"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 md:inset-6 z-50 flex items-center justify-center pointer-events-none p-4 md:p-0"
          >
            <div className="bg-[#FAF9F6] dark:bg-[#1a1a1a] w-full h-full md:h-[85vh] md:max-w-6xl rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row relative ring-1 ring-black/5 dark:ring-white/10">
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 z-50 p-2.5 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full backdrop-blur-md transition-all shadow-sm group"
              >
                <X className="w-5 h-5 text-stone-900 dark:text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* LEFT COLUMN: Visuals */}
              <div className="w-full md:w-[45%] h-[35vh] md:h-full bg-[#EFECE5] dark:bg-white/5 relative group overflow-hidden">
                <motion.img 
                  key={activeImage} // Triggers animation on change
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Highlights Badge */}
                <div className="absolute top-6 left-6 hidden md:block animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
                    {product.tagline && (
                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2">
                             <Sparkles className="w-3.5 h-3.5 text-[#AB462F]" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800 dark:text-white">
                                {product.tagline}
                             </span>
                        </div>
                    )}
                </div>

                {/* Mobile Gradient Overlay (Bottom) */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent md:hidden pointer-events-none" />
              </div>

              {/* RIGHT COLUMN: Details & Actions */}
              <div className="w-full md:w-[55%] h-full flex flex-col bg-white dark:bg-[#121212]">
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-8">
                  
                  {/* Product Header */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        {/* Breadcrumb-ish Category */}
                        {product.category && (
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AB462F] animate-in fade-in slide-in-from-bottom-1">
                                {product.category} Collection
                            </span>
                        )}
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-900 dark:text-white leading-[0.9]">
                                {product.name}
                            </h2>
                            <div className="text-right shrink-0">
                                <p className="text-2xl font-bold text-stone-900 dark:text-white">₱{product.price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ratings & Metadata */}
                    <div className="flex items-center gap-4 text-xs border-b border-stone-100 dark:border-white/10 pb-6">
                        <div className="flex items-center gap-1.5">
                            <div className="flex text-[#AB462F]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? "fill-current" : "opacity-30 text-stone-400"}`} />
                                ))}
                            </div>
                            <span className="font-bold text-stone-900 dark:text-white underline decoration-stone-300 underline-offset-4">
                                {product.reviews} Reviews
                            </span>
                        </div>
                        {product.weight && (
                            <>
                                <span className="text-stone-300">•</span>
                                <span className="text-stone-500 font-medium">{product.weight}</span>
                            </>
                        )}
                    </div>
                  </div>

                  {/* Variant Selection */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold uppercase tracking-widest text-stone-900 dark:text-white">Select Shade</span>
                          <span className="font-medium text-[#AB462F]">{selectedVariant?.name}</span>
                       </div>
                       
                       <div className="flex flex-wrap gap-3">
                          {product.variants.map((variant) => (
                             <button
                               key={variant.name}
                               onClick={() => setSelectedVariant(variant)}
                               className={`
                                 group relative w-12 h-12 rounded-full transition-all duration-300
                                 ${selectedVariant?.name === variant.name 
                                    ? 'ring-2 ring-[#AB462F] ring-offset-2 ring-offset-white dark:ring-offset-[#1a1a1a] scale-110' 
                                    : 'hover:scale-110 hover:ring-2 hover:ring-stone-200 dark:hover:ring-stone-700 ring-offset-2 ring-offset-transparent'}
                               `}
                             >
                               <span 
                                className="absolute inset-0 rounded-full border border-black/5 dark:border-white/10" 
                                style={{ backgroundColor: variant.color }} 
                               />
                               {selectedVariant?.name === variant.name && (
                                 <span className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-200">
                                   <Check className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
                                 </span>
                               )}
                             </button>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* Editorial Description Sections */}
                  <div className="space-y-8 pt-2">
                      
                      {/* What It Is */}
                      {product.whatItIs && (
                        <div className="space-y-2">
                           <h3 className="font-bold uppercase tracking-widest text-xs text-stone-400 mb-1">The Essentials</h3>
                           <p className="text-base text-stone-600 dark:text-stone-300 leading-relaxed font-light">
                              {product.whatItIs}
                           </p>
                        </div>
                      )}

                      {/* Why We Love It - Highlight Card */}
                      {product.whyWeLoveIt && (
                        <div className="bg-[#AB462F]/5 dark:bg-[#AB462F]/10 p-6 rounded-2xl border border-[#AB462F]/10 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Heart className="w-12 h-12 text-[#AB462F]" />
                           </div>
                           <h3 className="relative z-10 font-bold uppercase tracking-widest text-xs text-[#AB462F] mb-3 flex items-center gap-2">
                              Why We Love It
                           </h3>
                           <p className="relative z-10 text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                              {product.whyWeLoveIt}
                           </p>
                        </div>
                      )}

                      {/* Deep Dive Grid */}
                      {(product.howItFeels || product.theLook || product.skincare || product.whatMakesItSoGood) && (
                         <div className="grid grid-cols-1 gap-8 py-6 border-t border-b border-stone-100 dark:border-white/5">
                            {product.howItFeels && (
                               <div className="space-y-2">
                                  <h4 className="font-serif italic text-lg text-stone-900 dark:text-white">How it feels</h4>
                                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{product.howItFeels}</p>
                               </div>
                            )}

                            {product.theLook && (
                               <div className="space-y-2">
                                  <h4 className="font-serif italic text-lg text-stone-900 dark:text-white">The Look</h4>
                                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{product.theLook}</p>
                               </div>
                            )}
                            
                            {product.whatMakesItSoGood && (
                               <div className="space-y-2">
                                  <h4 className="font-serif italic text-lg text-stone-900 dark:text-white">What makes it so good</h4>
                                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{product.whatMakesItSoGood}</p>
                               </div>
                            )}

                            {product.skincare && (
                               <div className="space-y-2">
                                  <h4 className="font-serif italic text-lg text-stone-900 dark:text-white flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-blue-400" /> Skincare Benefits
                                  </h4>
                                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{product.skincare}</p>
                               </div>
                            )}
                         </div>
                      )}

                      {/* Claims Tags */}
                      {product.claims && product.claims.length > 0 && (
                        <div className="space-y-3 pb-4">
                           <h3 className="font-bold uppercase tracking-widest text-[10px] text-stone-400">
                              Claims
                           </h3>
                           <div className="flex flex-wrap gap-2">
                              {product.claims.map((claim, idx) => (
                                 <span 
                                   key={idx} 
                                   className="inline-flex items-center px-3 py-1.5 rounded-full bg-stone-100 dark:bg-white/5 border border-transparent hover:border-stone-300 dark:hover:border-white/20 transition-colors text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300"
                                 >
                                    <Check className="w-3 h-3 mr-1.5 text-[#AB462F]" />
                                    {claim}
                                 </span>
                              ))}
                           </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="sticky bottom-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-t border-stone-100 dark:border-white/10 p-4 md:p-6 z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                   <div className="flex gap-4 max-w-lg mx-auto md:max-w-none">
                      
                      {/* Quantity Stepper */}
                      <div className="flex items-center h-14 bg-stone-100 dark:bg-white/5 rounded-full px-2 shadow-inner">
                         <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-stone-500 hover:text-[#AB462F] transition-colors active:scale-90"
                         >
                            <Minus className="w-4 h-4" />
                         </button>
                         <span className="font-bold text-sm w-6 text-center text-stone-900 dark:text-white tabular-nums">{quantity}</span>
                         <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-stone-500 hover:text-[#AB462F] transition-colors active:scale-90"
                         >
                            <Plus className="w-4 h-4" />
                         </button>
                      </div>

                      {/* Add Button */}
                      <Button 
                         onClick={handleAddToCart}
                         className="flex-1 h-14 rounded-full bg-[#1a1a1a] dark:bg-white hover:bg-[#AB462F] dark:hover:bg-[#AB462F] text-white dark:text-black dark:hover:text-white font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                         <span className="flex items-center gap-2">
                             Add to Bag <span className="mx-1 opacity-30">|</span> ₱{(product.price * quantity).toLocaleString()}
                         </span>
                      </Button>
                   </div>
                </div>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}