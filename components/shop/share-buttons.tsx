"use client"

import * as React from "react"
import { Facebook, Twitter, Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"

export function ShareButtons({ productName }: { productName: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=Check out ${productName} on MIA!&url=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  return (
    <div className="mt-6 pt-6 border-t border-stone-100 dark:border-white/10 w-full">
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Share this product</p>
      <div className="flex gap-2">
        <button 
          onClick={handleFacebook}
          className="h-8 px-4 rounded-full border border-stone-200 dark:border-stone-700 hover:border-[#1877F2] hover:text-[#1877F2] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Facebook className="w-3 h-3" /> FB
        </button>

        <button 
          onClick={handleTwitter}
          className="h-8 px-4 rounded-full border border-stone-200 dark:border-stone-700 hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Twitter className="w-3 h-3" /> X
        </button>
        
        <button 
          onClick={handleCopy}
          className="h-8 px-4 rounded-full border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          {copied ? <Check className="w-3 h-3 text-green-600" /> : <LinkIcon className="w-3 h-3" />}
          {copied ? "Copied" : "Link"}
        </button>
      </div>
    </div>
  )
}