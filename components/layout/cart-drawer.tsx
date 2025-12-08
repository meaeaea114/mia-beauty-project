"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/cart-context"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FAF9F6] dark:bg-[#1a1a1a] shadow-2xl z-[70] flex flex-col border-l border-stone-200 dark:border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-black uppercase tracking-tight">Your Bag ({items.length})</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-stone-200 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-stone-500">Your bag is empty.</p>
                  <Button 
                    onClick={() => setIsCartOpen(false)}
                    variant="outline" 
                    className="rounded-full"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-4">
                    <div className="h-24 w-20 bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                           <h3 className="font-bold text-sm uppercase tracking-tight">{item.name}</h3>
                           <p className="font-semibold text-sm">₱{item.price * item.quantity}</p>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{item.variant || "Standard"}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-full h-7">
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant, -1)}
                            disabled={item.quantity <= 1}
                            className="px-2 h-full hover:text-[#AB462F] disabled:opacity-30 flex items-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.variant, 1)}
                            className="px-2 h-full hover:text-[#AB462F] flex items-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id, item.variant)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold tracking-tight">₱{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-stone-500 mb-4 text-center">Shipping & taxes calculated at checkout.</p>
                <Button className="w-full h-12 rounded-full font-bold tracking-widest uppercase bg-[#AB462F] hover:bg-[#944E45] text-white shadow-lg">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}