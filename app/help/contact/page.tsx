"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Message Sent",
        description: "We'll get back to you within 24 hours.",
        duration: 2000,
      })
    }, 1500)
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-xl">
        
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-center text-stone-500 mb-10">
          Have a question? We're here to help.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Name</label>
              <input type="text" className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-md px-4 py-3 focus:outline-none focus:border-[#AB462F]" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Email</label>
              <input type="email" className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-md px-4 py-3 focus:outline-none focus:border-[#AB462F]" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Subject</label>
            <select className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-md px-4 py-3 focus:outline-none focus:border-[#AB462F]">
              <option>Order Inquiry</option>
              <option>Product Question</option>
              <option>Return/Exchange</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Message</label>
            <textarea rows={5} className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-md px-4 py-3 focus:outline-none focus:border-[#AB462F]" required />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 rounded-full bg-[#AB462F] hover:bg-[#944E45] text-white font-bold tracking-[0.15em] uppercase text-xs"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>

        <div className="mt-12 text-center text-sm text-stone-500">
          <p>Or email us directly at <a href="mailto:hello@miabeauty.com" className="text-[#AB462F] underline">hello@miabeauty.com</a></p>
          <p className="mt-2">Customer Service Hours: Mon-Fri 9am-6pm EST</p>
        </div>

      </div>
    </div>
  )
}