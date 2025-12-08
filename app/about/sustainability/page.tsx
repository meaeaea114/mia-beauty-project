"use client"

import * as React from "react"

export default function SustainabilityPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-6">
            Conscious Beauty
          </h1>
          <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto">
            Beautiful products shouldn't cost the earth. We are committed to reducing our footprint one step at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
           <div className="space-y-6">
              <h3 className="text-2xl font-bold uppercase tracking-tight">Packaging</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Our primary packaging utilizes 50% PCR (Post-Consumer Recycled) plastic. We've eliminated secondary cartons where possible, and when we do use them, they are made from FSC-certified paper and printed with soy-based inks.
              </p>
           </div>
           <div className="aspect-square bg-[#E8E6E1] dark:bg-stone-800 relative overflow-hidden">
              <img src="/images/light_texture.jpg" alt="Recycled Materials" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-6xl">♻️</span>
              </div>
           </div>

           <div className="aspect-square bg-[#E8E6E1] dark:bg-stone-800 relative overflow-hidden order-last md:order-none">
              <img src="/images/dark_texture.jpg" alt="Carbon Neutral" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-6xl">🌱</span>
              </div>
           </div>
           <div className="space-y-6 order-3 md:order-none">
              <h3 className="text-2xl font-bold uppercase tracking-tight">Carbon Neutral</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                We offset 100% of carbon emissions from our shipping. For every order placed, we contribute to reforestation projects in the Philippines to help restore our natural forests.
              </p>
           </div>
        </div>

        <div className="mt-20 border-t border-stone-200 dark:border-stone-800 pt-10 text-center">
           <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Recycling Program</h3>
           <p className="text-stone-500 max-w-lg mx-auto">
             Return 5 empty MIA product containers to us and receive 15% off your next order. Email <span className="text-[#AB462F]">recycle@miabeauty.com</span> for a free shipping label.
           </p>
        </div>

      </div>
    </div>
  )
}