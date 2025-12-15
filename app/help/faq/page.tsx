"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, Minus, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FAQS = [
  {
    question: "Are your products cruelty-free?",
    answer: "Yes! MIA is 100% cruelty-free. We do not test on animals at any stage of product development, and we only work with vendors who uphold the same standards. We believe beauty should be kind."
  },
  {
    question: "How do I choose the right shade?",
    answer: "We recommend checking our product pages for detailed shade descriptions and real-life swatches on different skin tones. Our 'Shop The Look' section also shows full makeup recipes to help you visualize the products in action."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we ship exclusively within the Philippines. We deliver nationwide—from Metro Manila to provincial areas. We are working hard to bring MIA to the rest of the world soon!"
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for products that are damaged or incorrect. Due to the nature of personal care products, we cannot accept returns for used items unless there is a quality defect."
  },
  {
    question: "Are your products vegan?",
    answer: "Most of our products are vegan-friendly! We clearly label ingredients on every product page. Please check the specific item's description or our Ingredients page to be sure."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        
        {/* --- Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md mb-6">
             <HelpCircle className="w-3 h-3 text-[#AB462F]" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300">Help Center</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 text-[#1a1a1a] dark:text-white">
            Frequently Asked <br/> <span className="font-serif italic font-normal lowercase tracking-normal text-stone-500 dark:text-stone-400">questions</span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 font-light max-w-lg mx-auto leading-relaxed">
            Everything you need to know about our products, shipping, and more.
          </p>
        </motion.div>

        {/* --- FAQ Accordion --- */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                group border border-stone-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300
                ${openIndex === index 
                    ? 'bg-white dark:bg-white/10 shadow-xl scale-[1.01] border-[#AB462F]/30' 
                    : 'bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-md'}
              `}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex justify-between items-center w-full text-left p-6 md:p-8"
              >
                <span className={`text-lg md:text-xl font-bold uppercase tracking-tight transition-colors ${openIndex === index ? 'text-[#AB462F]' : 'text-[#1a1a1a] dark:text-white'}`}>
                    {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-all duration-300 ${openIndex === index ? 'bg-[#AB462F] text-white rotate-180' : 'bg-stone-100 dark:bg-white/10 text-stone-500'}`}>
                    {openIndex === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 md:px-8 pb-8">
                        <div className="h-px w-full bg-stone-100 dark:bg-white/5 mb-6" />
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-light text-base md:text-lg">
                        {faq.answer}
                        </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* --- Contact Fallback --- */}
        <div className="mt-20 text-center">
            <p className="text-stone-500 dark:text-stone-400 mb-4 font-medium">Still have questions?</p>
            <a href="/help/contact" className="inline-block border-b border-[#AB462F] pb-0.5 text-[#AB462F] font-bold uppercase tracking-widest text-xs hover:text-[#944E45] hover:border-[#944E45] transition-colors">
                Contact Support
            </a>
        </div>

      </div>
    </div>
  )
}