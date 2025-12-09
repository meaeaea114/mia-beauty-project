"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Minus, Plus, ShoppingBag, Star, 
    Facebook, Instagram, Twitter, 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/app/shop/page"

// MODIFIED: Product type now accepts an optional 'rank' property
interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: (Product & { rank?: number }) | null
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  
  const [quantity, setQuantity] = useState(1)
  const [activeVariant, setActiveVariant] = useState<any>(null)
  const [activeImage, setActiveImage] = useState("")

  // --- Dynamic Mock Post Content Generation ---
  const postTitle = product ? product.name : "New Product Drop"
  const postPrice = product ? `₱${product.price.toLocaleString()}` : "Amazing Price"
  const postTagline = product ? product.tagline : "Your everyday essential"

  const mockPostContent = `🚨 NEW OBSESSION ALERT! 🚨\n\nI just found the ultimate lip product: The ${postTitle}!\n\nIt's a ${postTagline} and it only costs ${postPrice}. Time to upgrade my makeup bag!\n\n#MIABeauty #CleanBeauty #LipGoals #NewDrop`

  const MOCK_LINKS = {
      // Facebook Sharing: Uses quote for text and u for generic image/link that can be ignored for this purpose.
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(mockPostContent)}`,
      
      // X (Twitter) Sharing: Uses text parameter.
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(mockPostContent)}`,
      
      // Instagram: Since IG does not support pre-filled posts via URL, we link to their profile or a landing page.
      instagram: "https://www.instagram.com/miabeautyinc", 
  }

  // Reset state when product opens
  useEffect(() => {
    if (product) {
      setQuantity(1)
      if (product.variants && product.variants.length > 0) {
        setActiveVariant(product.variants[0])
        setActiveImage(product.variants[0].image)
      } else {
        setActiveVariant(null)
        setActiveImage(product.image)
      }
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: activeImage,
      variant: activeVariant ? activeVariant.name : "Standard",
    })
    
    // Simulate adding multiple for this demo if context doesn't support bulk add yet
    for(let i = 1; i < quantity; i++) {
         addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: activeImage,
            variant: activeVariant ? activeVariant.name : "Standard",
         })
    }

    toast({
      title: "Added to Bag",
      description: `${quantity}x ${product.name} ${activeVariant ? `(${activeVariant.name})` : ""} added.`,
    })
    onClose()
  }

  const handleVariantClick = (variant: any) => {
      setActiveVariant(variant)
      setActiveImage(variant.image)
  }

  if (!product) return null

  // Determine the text to display in the top-left badge
  const badgeText = product.rank 
    ? `#${product.rank} BEST SELLER` 
    : (product.category?.toUpperCase() || "GENERAL")

  // Determine badge colors
  const badgeClasses = product.rank
    ? "bg-[#AB462F] text-white" // Use the accent color for Best Seller
    : "bg-white/90 dark:bg-black/80 backdrop-blur text-[#1a1a1a] dark:text-white border border-stone-200 dark:border-white/10"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-md transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="w-full max-w-5xl bg-[#FDFCFA] dark:bg-[#1a1a1a] rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] pointer-events-auto relative">
              
              {/* Close Button (Floating) */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#AB462F] hover:text-white transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT: Image Section */}
              <div className="w-full md:w-1/2 bg-[#E8E6E1] dark:bg-stone-800 relative group overflow-hidden h-[40vh] md:h-full">
                <motion.img
                  key={activeImage} // Triggers animation on change
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Ranking / Category Badge */}
                <div className="absolute top-6 left-6">
                    {/* MODIFIED: Dynamic badge classes applied here */}
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${badgeClasses}`}>
                        {badgeText}
                    </span>
                </div>
              </div>

              {/* RIGHT: Details Section */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#121212]">
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1a1a1a] dark:text-white leading-[0.9]">
                            {product.name}
                        </h2>
                    </div>
                    
                    <p className="font-serif italic text-stone-500 text-lg mb-3">
                        {product.tagline}
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-[#AB462F]">₱{product.price}</span>
                        <div className="h-4 w-px bg-stone-300"></div>
                        <div className="flex items-center gap-1 text-xs font-bold text-stone-500">
                             <div className="flex text-[#AB462F]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "fill-current" : "opacity-30"}`} />
                                ))}
                             </div>
                             <span>({product.reviews || 89} Reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Variants / Colors */}
                <div className="mb-8 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                            Shade: <span className="text-[#1a1a1a] dark:text-white">{activeVariant?.name || "Standard"}</span>
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {product.variants && product.variants.length > 0 ? (
                            product.variants.map((variant, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleVariantClick(variant)}
                                    className={`w-10 h-10 rounded-full transition-all duration-300 relative group flex items-center justify-center ${
                                        activeVariant?.name === variant.name 
                                        ? "ring-2 ring-offset-2 ring-[#AB462F] scale-110" 
                                        : "hover:scale-110 opacity-70 hover:opacity-100"
                                    }`}
                                    title={variant.name}
                                >
                                    <span 
                                        className="w-full h-full rounded-full border border-stone-200 dark:border-white/10 shadow-sm"
                                        style={{ backgroundColor: variant.color }} 
                                    />
                                </button>
                            ))
                        ) : (
                            // Fallback if no variants but colors array exists
                            product.colors?.map((color, idx) => (
                                <div key={idx} className="w-8 h-8 rounded-full border border-stone-200" style={{ backgroundColor: color }} />
                            ))
                        )}
                    </div>
                </div>

                {/* Description Text */}
                <div className="flex-grow mb-8">
                    <p className="text-sm text-stone-500 leading-relaxed">
                        {product.whatItIs || "Weightless, modern matte lipstick that feels like nothing on your lips. Formulated with silk-structure technology for a second-skin feel."}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-4">
                    <div className="flex gap-4">
                        {/* Quantity Selector */}
                        <div className="h-14 w-32 border border-stone-200 dark:border-stone-700 rounded-full flex items-center justify-between px-4 bg-stone-50 dark:bg-white/5">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-[#AB462F]"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-sm">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-[#AB462F]"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Add Button */}
                        <Button 
                            onClick={handleAddToCart}
                            className="flex-1 h-14 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4" /> Add to Bag — ₱{(product.price * quantity).toLocaleString()}
                            </span>
                        </Button>
                    </div>

                    {/* Footer Links (Share Icons) */}
                    <div className="flex justify-center items-center gap-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                        
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">SHARE:</span>
                        
                        {/* Facebook Share with Draft Post */}
                        <a href={MOCK_LINKS.facebook} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-blue-600">
                                <Facebook className="w-4 h-4" />
                            </Button>
                        </a>
                        
                        {/* X (Twitter) Share with Draft Post */}
                        <a href={MOCK_LINKS.twitter} target="_blank" rel="noopener noreferrer">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-black dark:hover:text-white">
                                <Twitter className="w-4 h-4" />
                            </Button>
                        </a>
                        
                        {/* Instagram (Direct Link) */}
                        <a href={MOCK_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-pink-600">
                                <Instagram className="w-4 h-4" />
                            </Button>
                        </a>
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