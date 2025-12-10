"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { X, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExitModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasShown])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-md p-8 rounded-2xl shadow-2xl relative text-center border border-stone-100 dark:border-stone-800">
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-[#AB462F] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-[#AB462F]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#AB462F]">
            <Gift className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-[#1a1a1a] dark:text-white">
          Wait! Don't Go!
        </h2>
        
        <p className="text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
          Get <span className="font-bold text-[#AB462F]">10% OFF</span> your first order. Use code <span className="font-mono bg-stone-100 dark:bg-white/10 px-2 py-1 rounded">MIA10</span> at checkout.
        </p>

        <div className="space-y-3">
            <Button 
              onClick={() => setIsVisible(false)}
              className="w-full h-12 rounded-full bg-[#AB462F] hover:bg-[#944E45] text-white font-bold uppercase tracking-widest text-xs shadow-lg"
            >
              Claim Offer
            </Button>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 underline decoration-stone-300 underline-offset-4"
            >
              No thanks
            </button>
        </div>
      </div>
    </div>
  )
}