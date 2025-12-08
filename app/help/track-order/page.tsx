"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function TrackOrderPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Order Found",
        description: "Redirecting to tracking details...",
        duration: 2000,
      })
    }, 1500)
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-md flex flex-col items-center">
        
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4 text-center">
          Track Your Order
        </h1>
        <p className="text-center text-stone-500 mb-10 leading-relaxed">
          Enter your order number and email address to find your order status.
        </p>

        <form onSubmit={handleTrack} className="w-full space-y-4">
          <input 
            type="text" 
            placeholder="Order Number" 
            className="w-full bg-white dark:bg-white/5 border-transparent focus:border-[#AB462F] rounded-md px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-0 transition-all"
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-white dark:bg-white/5 border-transparent focus:border-[#AB462F] rounded-md px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-0 transition-all"
            required
          />

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 mt-4 rounded-full bg-[#E6D5C4] hover:bg-[#D6C0AB] text-[#4A403A] font-bold tracking-[0.15em] uppercase text-xs shadow-none transition-colors dark:bg-[#C6A87C] dark:text-black dark:hover:bg-[#B59665]"
          >
            {isLoading ? "Tracking..." : "Track Order"}
          </Button>
        </form>

      </div>
    </div>
  )
}