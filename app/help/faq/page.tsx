"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FAQS = [
  {
    question: "Are your products cruelty-free?",
    answer: "Yes! MIA Beauty is 100% cruelty-free. We do not test on animals at any stage of product development, and we only work with vendors who uphold the same standards."
  },
  {
    question: "How do I choose the right shade?",
    answer: "We recommend checking our product pages for detailed shade descriptions and swatches on different skin tones. You can also use our Virtual Try-On feature available on select product pages."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to select countries worldwide. International shipping costs and delivery times vary by location. Please check our Shipping policy for more details."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all products. If you're not satisfied with your purchase, you can return it for a full refund or exchange."
  },
  {
    question: "Are your products vegan?",
    answer: "Most of our products are vegan. Please check the individual product ingredients list to confirm if a specific item is vegan."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-12 text-center">
          FAQ
        </h1>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="border-b border-stone-200 dark:border-white/10 pb-4">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex justify-between items-center w-full text-left py-2 hover:text-[#AB462F] transition-colors"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                {openIndex === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}