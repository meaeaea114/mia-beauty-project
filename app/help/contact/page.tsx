"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Clock, Send, MapPin } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Inquiry",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Message Sent",
        description: "We'll get back to you within 24 hours.",
        duration: 3000,
      })
      // Reset form
      setFormData({ name: "", email: "", subject: "Order Inquiry", message: "" })
    }, 1500)
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        
        {/* --- Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md mb-6">
             <MessageSquare className="w-3 h-3 text-[#AB462F]" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300">Get in Touch</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 text-[#1a1a1a] dark:text-white leading-[0.9]">
            We're here <br/> <span className="font-serif italic font-normal lowercase tracking-normal text-stone-500 dark:text-stone-400">to help</span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 font-light max-w-lg mx-auto leading-relaxed">
            Questions about your order? Need shade matching advice? <br/>
            Our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* --- Contact Info Column --- */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-5 space-y-10"
            >
                <div className="p-8 rounded-[32px] bg-[#EFECE5] dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-sm">
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-6">Customer Care</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shrink-0 text-[#AB462F]">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">Email Us</p>
                                <a href="mailto:hello@miabeauty.com" className="text-lg font-medium hover:text-[#AB462F] transition-colors">hello@miabeauty.com</a>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shrink-0 text-[#AB462F]">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">Hours</p>
                                <p className="text-stone-700 dark:text-stone-300">Mon - Fri, 9am - 6pm PHT</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shrink-0 text-[#AB462F]">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">HQ</p>
                                <p className="text-stone-700 dark:text-stone-300">Makati City, Philippines</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h4 className="font-serif italic text-2xl mb-4 text-[#1a1a1a] dark:text-white">"Real beauty is about being comfortable in your own skin. We're just here to help you shine."</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#AB462F]">— The MIA Team</p>
                </div>
            </motion.div>

            {/* --- Form Column --- */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-7"
            >
                <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[40px] p-8 md:p-12 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#AB462F] focus:ring-1 focus:ring-[#AB462F] transition-all"
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#AB462F] focus:ring-1 focus:ring-[#AB462F] transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Subject</label>
                            <div className="relative">
                                <select 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full appearance-none bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#AB462F] focus:ring-1 focus:ring-[#AB462F] transition-all text-stone-700 dark:text-stone-300"
                                >
                                    <option>Order Inquiry</option>
                                    <option>Product Question</option>
                                    <option>Return/Exchange</option>
                                    <option>Collaboration</option>
                                    <option>Other</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Message</label>
                            <textarea 
                                rows={6} 
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-[#AB462F] focus:ring-1 focus:ring-[#AB462F] transition-all resize-none"
                                placeholder="How can we help?"
                            />
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-14 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.2em] uppercase text-xs shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">Sending...</span>
                                ) : (
                                    <span className="flex items-center gap-2">Send Message <Send className="w-4 h-4" /></span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  )
}