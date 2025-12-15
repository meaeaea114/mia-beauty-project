"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, X, ShieldAlert } from "lucide-react"

const INGREDIENTS = [
  { name: "Niacinamide", desc: "A powerhouse vitamin that improves skin texture and strengthens the barrier." },
  { name: "Hyaluronic Acid", desc: "The ultimate hydrator. Holds 1000x its weight in water for plump skin." },
  { name: "Centella Asiatica", desc: "Soothing and healing. Calms redness and irritation instantly." },
  { name: "Squalane", desc: "Plant-derived moisture that locks in hydration without clogging pores." },
  { name: "Rosehip Oil", desc: "Rich in antioxidants and fatty acids to brighten and protect." },
  { name: "Peptides", desc: "Amino acid chains that signal skin to produce more collagen." },
]

export default function IngredientsPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        
        {/* --- Header Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="h-px w-8 bg-[#AB462F]" />
             <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#AB462F]">
                Our Standard
             </span>
             <div className="h-px w-8 bg-[#AB462F]" />
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 text-[#1a1a1a] dark:text-white leading-[0.9]">
            Key <span className="font-serif italic font-normal lowercase tracking-normal text-stone-500 dark:text-stone-400">ingredients</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-2xl mx-auto">
            We believe in transparency. Every ingredient is chosen with purpose—to nourish, protect, and enhance your natural beauty without compromise.
          </p>
        </motion.div>

        {/* --- Ingredients Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {INGREDIENTS.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 md:p-10 rounded-[32px] bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
            >
              <div className="flex items-start justify-between mb-4">
                 <h3 className="text-2xl font-bold uppercase tracking-tight text-[#1a1a1a] dark:text-white group-hover:text-[#AB462F] transition-colors">
                    {item.name}
                 </h3>
                 <div className="w-2 h-2 rounded-full bg-[#AB462F] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-light text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- The No-List Section --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[40px] bg-[#1a1a1a] dark:bg-white/10 text-white p-12 md:p-16 text-center relative overflow-hidden"
        >
            {/* Decorative Background Blur */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-full bg-[#AB462F] opacity-10 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6">
                    <ShieldAlert className="w-3 h-3 text-[#AB462F]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Clean Beauty Promise</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">
                    The No-List
                </h2>
                
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {["Parabens", "Sulfates", "Phthalates", "Mineral Oil", "Synthetic Fragrance", "Talc"].map((badItem, idx) => (
                        <span 
                            key={idx} 
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors cursor-default"
                        >
                            <X className="w-3 h-3 text-[#AB462F]" /> {badItem}
                        </span>
                    ))}
                </div>
                
                <p className="mt-10 text-white/60 text-sm font-light">
                    Formulated strictly without the ingredients that don't serve your skin.
                </p>
            </div>
        </motion.div>

      </div>
    </div>
  )
}