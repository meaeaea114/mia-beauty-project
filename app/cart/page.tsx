"use client"

import * as React from "react"
import { useState } from "react"
import { useCart } from "@/app/context/cart-context"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Simple Modal Component for Guest/Login Decision
const CheckoutAuthModal = ({ isOpen, onClose, onGuest, onLogin }: any) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-center">Checkout</h2>
        <p className="text-stone-500 text-center mb-8">How would you like to proceed?</p>
        
        <div className="space-y-4">
          <Button 
            onClick={onLogin}
            className="w-full h-14 bg-[#AB462F] hover:bg-[#944E45] text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" /> Log In for Rewards
          </Button>
          
          <div className="relative flex items-center justify-center">
             <div className="h-px bg-stone-200 w-full absolute" />
             <span className="bg-white px-2 text-[10px] text-stone-400 uppercase tracking-widest relative z-10">Or</span>
          </div>

          <Button 
            onClick={onGuest}
            variant="outline"
            className="w-full h-14 border-stone-200 hover:bg-stone-50 text-[#1a1a1a] rounded-full font-bold uppercase tracking-widest text-xs"
          >
            Continue as Guest
          </Button>
        </div>
        
        <button onClick={onClose} className="w-full text-center mt-6 text-xs text-stone-400 hover:text-[#AB462F] underline">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()
  const [coupon, setCoupon] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleApplyCoupon = () => {
      if (coupon.toUpperCase() === "MIA20") {
          setDiscount(subtotal * 0.20)
          toast({ title: "Coupon Applied", description: "20% Discount applied successfully!" })
      } else {
          toast({ title: "Invalid Coupon", description: "Code not found or expired.", variant: "destructive" })
          setDiscount(0)
      }
  }

  const handleProceed = () => {
      const user = localStorage.getItem("mia-beauty-profile")
      if (user) {
        // User is already logged in, go straight to checkout
        router.push("/checkout")
      } else {
        // Show choice modal
        setIsAuthModalOpen(true)
      }
  }

  return (
    // MODIFIED: Changed solid background to transparent
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4 md:px-8 font-sans text-[#1a1a1a] dark:text-white">
        <CheckoutAuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          onGuest={() => router.push("/checkout")}
          onLogin={() => router.push("/account/login?redirect=/checkout")}
        />

        <h1 className="text-4xl font-black uppercase tracking-tighter mb-10 text-center text-foreground">Your Bag</h1>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-black/20 rounded-lg border border-stone-200 dark:border-stone-700">
                        <p className="text-stone-500 mb-4">Your bag is empty.</p>
                        <Link href="/shop"><Button>Shop Now</Button></Link>
                    </div>
                ) : (
                    items.map(item => (
                        <div 
                          key={`${item.id}-${item.variant}`} 
                          // MODIFIED: Applied custom glassmorphism styles for item cards
                          className="flex gap-6 p-4 bg-white/70 dark:bg-black/40 border border-white/60 dark:border-white/10 rounded-lg backdrop-blur-md shadow-md"
                        >
                            <div className="w-24 h-24 bg-stone-50 dark:bg-black/50 flex items-center justify-center shrink-0 border border-stone-100 dark:border-white/10 rounded-md">
                                <img src={item.image} alt={item.name} className="h-full object-contain p-2" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-bold uppercase text-sm text-foreground">{item.name}</h3>
                                        <p className="text-xs text-stone-500">{item.variant}</p>
                                    </div>
                                    <p className="font-bold text-sm text-foreground">₱{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-md h-8 w-24">
                                        {/* MODIFIED: Added dark hover class to quantity buttons */}
                                        <button onClick={() => updateQuantity(item.id, item.variant, -1)} className="w-8 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800"><Minus className="w-3 h-3"/></button>
                                        <span className="flex-1 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.variant, 1)} className="w-8 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800"><Plus className="w-3 h-3"/></button>
                                    </div>
                                    <button onClick={() => removeItem(item.id, item.variant)} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                {/* MODIFIED: Applied the 'glass' utility class for the glassmorphism effect */}
                <div className="glass p-6 rounded-xl sticky top-32 shadow-2xl">
                    <h2 className="font-bold uppercase tracking-widest text-sm mb-4 text-foreground">Order Summary</h2>
                    
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" 
                            placeholder="Coupon Code" 
                            // MODIFIED: Added dark mode classes for input contrast
                            className="flex-1 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-2 text-xs uppercase dark:bg-black/20 dark:text-white"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                        />
                        <Button size="sm" variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                    </div>

                    <div className="space-y-3 text-sm text-stone-600 dark:text-stone-300 border-t pt-4 border-stone-200 dark:border-white/10">
                        <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground">₱{subtotal.toLocaleString()}</span></div>
                        {discount > 0 && <div className="flex justify-between text-[#AB462F]"><span>Discount</span><span>-₱{discount.toLocaleString()}</span></div>}
                        <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
                    </div>

                    <div className="flex justify-between font-black text-lg mt-4 pt-4 border-t border-stone-200 dark:border-white/10">
                        <span>Total</span>
                        <span className="text-foreground">₱{(subtotal - discount).toLocaleString()}</span>
                    </div>

                    <Button 
                        className="w-full mt-6 bg-[#1a1a1a] hover:bg-[#AB462F] text-white rounded-full h-12 uppercase font-bold text-xs tracking-widest" 
                        onClick={handleProceed}
                        disabled={items.length === 0}
                    >
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}