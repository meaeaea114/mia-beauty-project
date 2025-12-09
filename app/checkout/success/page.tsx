// app/checkout/success/page.tsx
"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle2, ShoppingBag, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase" // Import Supabase

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || "MIA-0000"
  
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    // 1. Session Strategy (Immediate / Fast)
    const sessionData = sessionStorage.getItem("last_order_details")
    if (sessionData) {
        setOrder(JSON.parse(sessionData))
        return
    }

    // 2. Database Strategy (Persistence / Refresh)
    const fetchOrder = async () => {
        // Fetch from Supabase Orders table
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (data) {
            setOrder({
                id: data.id,
                customer: data.customer_details,
                total: data.total_amount,
                items: data.items
            })
        }
    }
    fetchOrder()
  }, [orderId])

  // Fix: Use the customer's name if available
  const customerName = order?.customer?.firstName || "Beauty"
  const total = order?.total || 0
  const items = order?.items || []

  return (
    // MODIFIED: Changed solid background to transparent
    <div className="min-h-screen bg-transparent font-sans text-[#1a1a1a] flex flex-col items-center justify-center pt-32 pb-20 px-4">
        <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4">
                <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Order Confirmed!</h1>
                    <p className="text-stone-500">Thank you for your purchase, {customerName}.</p>
                </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xl">
                <div className="bg-[#FAF9F6] p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Order Reference</p>
                        <p className="font-mono font-bold text-xl text-[#AB462F] tracking-wide">{orderId}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Amount</p>
                        <p className="font-black text-2xl text-[#1a1a1a]">₱{total.toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-stone-400 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 -z-10" />
                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10 text-[#AB462F]"><CheckCircle2 className="w-5 h-5" /><span>Confirmed</span></div>
                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10"><ShoppingBag className="w-5 h-5" /><span>Packed</span></div>
                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10"><Truck className="w-5 h-5" /><span>Shipped</span></div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Items Ordered</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {items.length > 0 ? items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 py-2 border-b border-stone-50 last:border-0">
                                    <div className="h-12 w-12 bg-stone-100 rounded-md overflow-hidden flex-shrink-0 border border-stone-200">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm uppercase">{item.name}</p>
                                        <p className="text-[10px] text-stone-500">{item.variant}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-stone-900">x{item.quantity}</p>
                                        <p className="text-xs text-stone-500">₱{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-stone-400 italic">Retrieving details...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 pt-4 text-center">
                <Link href="/shop"><Button className="w-full h-14 bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-lg">Continue Shopping</Button></Link>
                <Link href="/help/track-order" className="text-xs font-bold uppercase tracking-widest text-[#AB462F] hover:underline block mt-4">Track Order Status</Link>
            </div>
        </div>
    </div>
  )
}