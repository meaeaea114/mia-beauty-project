"use client"

import * as React from "react"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans selection:bg-[#AB462F] selection:text-white pt-32 pb-20">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#AB462F] mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 text-foreground">
            Beauty For <br/> Real Life
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            MIA was born out of the desire for beauty products that feel like you. We believe in makeup that enhances, not masks—products designed to be lived in, not just worn.
          </p>
        </div>
      </section>

      {/* Image Banner */}
      <div className="w-full h-[60vh] bg-stone-200 dark:bg-stone-900 mb-24 overflow-hidden relative">
         <img 
            src="/images/image_f26740.jpg" // Using one of your uploaded images as a placeholder
            alt="MIA Studio" 
            className="w-full h-full object-cover grayscale opacity-80"
         />
      </div>

      {/* Values Grid */}
      <section className="container mx-auto px-4 md:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
                <div className="h-16 w-16 bg-[#AB462F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">晴</span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Cruelty Free</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    We never test on animals. Our furry friends are for cuddling, not testing.
                </p>
            </div>
            <div className="space-y-4">
                <div className="h-16 w-16 bg-[#AB462F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">諺</span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Clean Ingredients</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Formulated without parabens, sulfates, or phthalates. Just the good stuff.
                </p>
            </div>
            <div className="space-y-4">
                <div className="h-16 w-16 bg-[#AB462F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">訣</span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Sustainable</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    We're committed to reducing our footprint with recyclable packaging.
                </p>
            </div>
        </div>
      </section>

      {/* Philosophy Text */}
      {/* MODIFIED: Changed solid background to semi-transparent to allow texture through */}
      <section className="bg-[#FAF9F6]/50 dark:bg-black/50 py-24">
          <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                  <h2 className="text-4xl font-bold uppercase tracking-tight mb-6">The MIA Philosophy</h2>
                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>
                          We started MIA because we were tired of the 10-step routines and the pressure to be perfect. We wanted products that were intuitive, easy to use, and actually good for our skin.
                      </p>
                      <p>
                          Our "less is more" approach means every product in our lineup is a multitasker. From our multi-use pigments to our skincare-infused base products, everything is designed to streamline your routine without sacrificing results.
                      </p>
                  </div>
              </div>
              <div className="order-1 md:order-2 h-[500px] bg-stone-300 dark:bg-stone-800 overflow-hidden relative">
                  <img src="/images/image_f1e87b.jpg" alt="MIA Philosophy" className="w-full h-full object-cover" />
              </div>
          </div>
      </section>

    </div>
  )
}