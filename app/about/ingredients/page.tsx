"use client"

import * as React from "react"

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
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-6 text-center">
          Key Ingredients
        </h1>
        <p className="text-center text-stone-500 mb-16 max-w-2xl mx-auto leading-relaxed">
          We believe in transparency. Every ingredient is chosen with purpose—to nourish, protect, and enhance your natural beauty without compromise.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {INGREDIENTS.map((item, i) => (
            <div key={i} className="border-t border-stone-200 dark:border-white/10 pt-6">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-[#AB462F]">{item.name}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-[#FAF9F6] dark:bg-white/5 text-center">
          <h4 className="font-bold uppercase tracking-widest text-sm mb-4">The No-List</h4>
          <p className="text-sm text-stone-500">
            Formulated without: Parabens, Sulfates, Phthalates, Mineral Oil, Synthetic Fragrance, or Talc.
          </p>
        </div>

      </div>
    </div>
  )
}