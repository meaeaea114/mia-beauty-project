"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Recycle, Leaf } from "lucide-react"

// KEY FIX: Ensure this is 'export default function'
export default function SustainabilityPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="h-px w-8 bg-[#AB462F]" />
             <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#AB462F]">
                Our Commitment
             </span>
             <div className="h-px w-8 bg-[#AB462F]" />
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 text-[#1a1a1a] dark:text-white leading-[0.9]">
            Conscious <span className="font-serif italic font-normal lowercase tracking-normal text-stone-500 dark:text-stone-400">beauty</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-2xl mx-auto">
            Beautiful products shouldn't cost the earth. We are committed to reducing our footprint one step at a time.
          </p>
        </motion.div>
      </section>

      {/* --- CONTENT GRID --- */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
           
           {/* 1. Packaging */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="flex flex-col justify-center space-y-6"
           >
              <div className="w-12 h-12 bg-[#AB462F]/10 rounded-full flex items-center justify-center text-[#AB462F] mb-2">
                  <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tight text-[#1a1a1a] dark:text-white">Packaging</h3>
              <div className="w-16 h-1 bg-[#AB462F]" />
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-light text-lg">
                Our primary packaging utilizes <strong className="font-bold text-[#AB462F]">50% PCR</strong> (Post-Consumer Recycled) plastic. We've eliminated secondary cartons where possible, and when we do use them, they are made from FSC-certified paper and printed with soy-based inks.
              </p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative aspect-square rounded-[40px] overflow-hidden bg-[#EFECE5] dark:bg-white/5 shadow-lg group"
           >
              {/* Image Placeholder */}
              <img 
                src="/images/packaging-eco.jpg" 
                alt="Eco-friendly Packaging" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
           </motion.div>

           {/* 2. Carbon Neutral (Alternating Layout) */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative aspect-square rounded-[40px] overflow-hidden bg-[#EFECE5] dark:bg-white/5 shadow-lg order-last md:order-none group"
           >
              <img 
                src="/images/carbon-neutral.jpg" 
                alt="Carbon Neutral Initiative" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="flex flex-col justify-center space-y-6 md:pl-10 order-3 md:order-none"
           >
              <div className="w-12 h-12 bg-[#AB462F]/10 rounded-full flex items-center justify-center text-[#AB462F] mb-2">
                  <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tight text-[#1a1a1a] dark:text-white">Carbon Neutral</h3>
              <div className="w-16 h-1 bg-[#AB462F]" />
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-light text-lg">
                We offset 100% of carbon emissions from our shipping. For every order placed, we contribute to reforestation projects in the Philippines to help restore our natural forests.
              </p>
           </motion.div>

        </div>
      </section>

    </div>
  )
}