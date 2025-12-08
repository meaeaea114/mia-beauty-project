"use client"

import * as React from "react"

export default function ShippingPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-8 text-center">
          Shipping & Returns
        </h1>

        <div className="space-y-12 text-[#1a1a1a] dark:text-stone-300 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#AB462F]">Shipping Policy</h2>
            <p>
              We process orders within 1-2 business days. You will receive a shipping confirmation email with tracking details as soon as your order has been dispatched.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-stone-500 dark:text-stone-400">
              <li><strong>Standard Shipping:</strong> 3-5 business days (₱150, Free over ₱1,500)</li>
              <li><strong>Express Shipping:</strong> 1-2 business days (₱250)</li>
              <li><strong>International:</strong> 7-14 business days (Rates calculated at checkout)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#AB462F]">Returns & Exchanges</h2>
            <p>
              We want you to love your MIA products. If you are not completely satisfied, we accept returns on lightly used products within 30 days of purchase.
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              To initiate a return, please visit our <a href="/help/contact" className="underline hover:text-[#AB462F]">Contact Us</a> page or email us at support@miabeauty.com with your order number.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#AB462F]">Damaged Items</h2>
            <p>
              If your order arrives damaged, please contact us immediately with a photo of the damaged item and your order number. We will send a replacement right away.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}