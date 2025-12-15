"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Truck, RotateCcw, ShieldCheck, MapPin } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        
        {/* --- Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md mb-6">
             <Truck className="w-3 h-3 text-[#AB462F]" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300">Delivery Information</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 text-[#1a1a1a] dark:text-white leading-[0.9]">
            Shipping & <br/> <span className="font-serif italic font-normal lowercase tracking-normal text-stone-500 dark:text-stone-400">returns</span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 font-light max-w-lg mx-auto leading-relaxed">
            We deliver nationwide across the Philippines. Here's everything you need to know about getting your order.
          </p>
        </motion.div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Shipping Policy Column */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-10"
            >
                <div className="bg-[#EFECE5] dark:bg-white/5 border border-stone-200 dark:border-white/10 p-10 rounded-[40px] shadow-sm">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-[#AB462F]" /> Shipping Policy
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed mb-6 font-light">
                        We process orders within <strong className="font-bold text-[#1a1a1a] dark:text-white">1-2 business days</strong>. You will receive a shipping confirmation email with tracking details as soon as your order has been dispatched from our Manila warehouse.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/40 dark:border-white/5 backdrop-blur-sm">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white">Metro Manila</p>
                                <p className="text-xs text-stone-500">Standard Delivery</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#AB462F]">1-3 Days</p>
                                <p className="text-xs text-stone-500">₱100</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/40 dark:border-white/5 backdrop-blur-sm">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white">Luzon</p>
                                <p className="text-xs text-stone-500">Provincial Delivery</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#AB462F]">3-5 Days</p>
                                <p className="text-xs text-stone-500">₱150</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/40 dark:border-white/5 backdrop-blur-sm">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a] dark:text-white">Visayas & Mindanao</p>
                                <p className="text-xs text-stone-500">Nationwide Delivery</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#AB462F]">5-7 Days</p>
                                <p className="text-xs text-stone-500">₱200</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-stone-300 dark:border-white/10 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#AB462F]">
                            Free Shipping on orders over ₱1,500 (Metro Manila)
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Returns & Damages Column */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-10"
            >
                <div className="p-8 md:p-10 rounded-[40px] border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                        <RotateCcw className="w-6 h-6 text-[#AB462F]" /> Returns & Exchanges
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-light mb-4">
                        We want you to love your MIA products. If you are not completely satisfied, we accept returns on items that are damaged or incorrect within <strong className="font-bold">7 days</strong> of receipt.
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Due to hygiene reasons, we cannot accept returns for change of mind on opened or used cosmetics unless there is a clear quality defect.
                    </p>
                </div>

                <div className="p-8 md:p-10 rounded-[40px] border border-stone-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-[#AB462F]" /> Damaged Items
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-light mb-6">
                        If your order arrives damaged, please contact us immediately with a photo of the damaged item and your order number. We will verify and send a replacement right away.
                    </p>
                    
                    <a href="/help/contact" className="inline-block border-b border-[#AB462F] pb-0.5 text-[#AB462F] font-bold uppercase tracking-widest text-xs hover:text-[#944E45] hover:border-[#944E45] transition-colors">
                        Report an Issue
                    </a>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  )
}