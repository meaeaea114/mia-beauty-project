"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, ShieldCheck, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans selection:bg-[#AB462F] selection:text-white pt-28 pb-32">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#AB462F] mb-6 block">
            Our Philosophy
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 text-[#1a1a1a] dark:text-white leading-[0.9]">
            Beauty For <br/> <span className="font-serif italic font-normal lowercase tracking-normal text-[#AB462F]">real</span> Life
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-2xl mx-auto">
            MIA was born out of the desire for beauty products that feel like you. We believe in makeup that enhances, not masks—products designed to be lived in, not just worn.
          </p>
        </motion.div>
      </section>

      {/* --- 2. SPLIT LAYOUT STORY SECTION --- */}
      <section className="w-full mb-32">
        <div className="container mx-auto px-6 md:px-12">
            <div className="rounded-[40px] overflow-hidden bg-[#EFECE5] dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                    
                    {/* Image Side */}
                    <div className="relative h-[400px] lg:h-full w-full overflow-hidden group">
                        <img 
                            src="/images/about-hero.jpg" 
                            alt="MIA Studio Moment" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 grayscale-[10%] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Text Side */}
                    <div className="flex flex-col justify-center p-10 lg:p-20 space-y-8 bg-white/50 dark:bg-transparent backdrop-blur-sm">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#1a1a1a] dark:text-white">
                            The MIA <br/> Standard
                        </h2>
                        <div className="space-y-6 text-stone-600 dark:text-stone-300 text-base leading-relaxed font-light">
                            <p>
                                We started MIA because we were tired of the 10-step routines and the pressure to be perfect. We wanted products that were intuitive, easy to use, and actually good for our skin.
                            </p>
                            <p>
                                Our "less is more" approach means every product in our lineup is a multitasker. From our multi-use pigments to our skincare-infused base products, everything is designed to streamline your routine without sacrificing results.
                            </p>
                        </div>
                        
                        {/* Signature */}
                        <div className="pt-4">
                            <p className="font-serif italic text-2xl text-[#AB462F]">- The Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 3. VALUES GRID --- */}
      <section className="container mx-auto px-6 md:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Value 1 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-stone-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-16 w-16 bg-[#AB462F]/10 text-[#AB462F] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Cruelty Free</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
                    We never test on animals. Our furry friends are for cuddling, not testing. We are proudly Leaping Bunny certified.
                </p>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-stone-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-16 w-16 bg-[#AB462F]/10 text-[#AB462F] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Clean Ingredients</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
                    Formulated without parabens, sulfates, phthalates, or synthetic fragrances. Just the good stuff your skin loves.
                </p>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/60 dark:bg-white/5 border border-stone-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-16 w-16 bg-[#AB462F]/10 text-[#AB462F] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Sustainable</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
                    We're committed to reducing our footprint. Our packaging is made with PCR materials and is 100% recyclable.
                </p>
            </div>

        </div>
      </section>

    </div>
  )
}