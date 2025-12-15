// app/checkout/success/page.tsx
"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { CheckCircle2, ShoppingBag, Truck, MapPin, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase" 

// --- TRACKING STEP CONFIG (Simpler for success page) ---
const TRACKING_STEPS = [
    { id: 'Confirmed', label: 'Order Confirmed' },
    { id: 'Packed', label: 'Processing' },
    { id: 'Shipped', label: 'Out for Delivery' },
    { id: 'Delivered', label: 'Delivered' }
];

function OrderSuccessContent() { 
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || "MIA-0000"
  
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    let isMounted = true;
    
    const fetchOrder = async () => {
        // 1. Session Strategy (Immediate / Fast)
        const sessionData = sessionStorage.getItem("last_order_details")
        if (sessionData) {
            if (isMounted) setOrder(JSON.parse(sessionData))
            return
        }

        // 2. Database Strategy (Persistence / Refresh)
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (data && isMounted) {
            setOrder({
                id: data.id,
                customer: data.customer_details,
                total: data.total_amount,
                items: data.items,
                payment_method: data.payment_method
            })
        }
    }
    fetchOrder()

    return () => { isMounted = false; }
  }, [orderId])

  const customerName = order?.customer?.firstName || "Beauty"
  const total = order?.total || 0
  const items = order?.items || []
  const paymentMethod = order?.payment_method || 'Online Payment'

  // Determine active step for tracker visualization
  const getTrackerStep = (status: string) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('delivered') || statusLower.includes('completed')) return 3;
    if (statusLower.includes('shipped') || statusLower.includes('transit')) return 2;
    if (statusLower.includes('packed') || statusLower.includes('paid')) return 1;
    return 0;
  };
  const activeStep = getTrackerStep(order?.status);

  return (
    // FIX 1: bg-transparent and dark text
    <div className="min-h-screen bg-transparent font-sans text-[#1a1a1a] dark:text-white flex flex-col items-center justify-center pt-28 pb-20 px-4">
        <div className="max-w-3xl w-full space-y-10 animate-in fade-in zoom-in-95 duration-500">
            
            {/* --- CONFIRMATION HEADER --- */}
            <div className="text-center space-y-4">
                <div className="mx-auto h-20 w-20 bg-green-100/80 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-1 leading-none">
                        Order <span className="font-serif italic font-normal text-[#AB462F] lowercase">Confirmed!</span>
                    </h1>
                    <p className="text-stone-600 dark:text-stone-300 text-lg">Thank you for your purchase, {customerName}.</p>
                </div>
            </div>

            {/* --- MAIN ORDER CARD (AESTHETIC UPGRADE) --- */}
            <div className="bg-white/80 dark:bg-black/40 border border-stone-200 dark:border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm">
                
                {/* Reference & Total Header */}
                <div className="bg-[#FAF9F6] dark:bg-white/5 p-8 border-b border-stone-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Order Reference</p>
                        <p className="font-mono font-black text-2xl text-[#1a1a1a] dark:text-white tracking-wide">{orderId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Amount</p>
                        <p className="font-black text-4xl text-[#AB462F] leading-none">₱{total.toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    
                    {/* STATUS TRACKER */}
                    <div className="w-full py-4">
                        <div className="flex items-start justify-between relative">
                            <div className="absolute left-0 top-3 w-full h-0.5 bg-stone-200 dark:bg-stone-700 -z-10" />
                            <div className="absolute left-0 top-3 h-0.5 bg-[#AB462F] -z-10 transition-all duration-500" style={{ width: `${(activeStep / (TRACKING_STEPS.length - 1)) * 100}%` }} />
                            
                            {TRACKING_STEPS.map((step, index) => {
                                const isActive = index <= activeStep;
                                const Icon = index === 0 ? CheckCircle2 : index === 1 ? ShoppingBag : index === 2 ? Truck : CheckCircle2;
                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 max-w-[70px] text-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-[#AB462F] bg-[#AB462F] text-white' : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-black/20 text-stone-300'}`}>
                                            <Icon className="w-3 h-3" />
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest leading-tight ${isActive ? 'text-[#AB462F]' : 'text-stone-400'}`}>{step.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    <div className="border-t border-stone-200 dark:border-stone-700 pt-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Items Ordered</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {items.length > 0 ? items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 py-2 border-b border-stone-100 dark:border-white/5 last:border-0">
                                    <div className="h-12 w-12 bg-stone-100 dark:bg-black/20 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200 dark:border-stone-700">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm uppercase text-[#1a1a1a] dark:text-white">{item.name}</p>
                                        <p className="text-[10px] text-stone-500 dark:text-stone-400">{item.variant}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-stone-900 dark:text-white">x{item.quantity}</p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">₱{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-stone-400 italic">No item details available.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#FAF9F6] dark:bg-white/5 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Payment Details</h3>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-600 dark:text-stone-300">Method:</span>
                            <span className="font-bold text-[#AB462F]">{paymentMethod}</span>
                        </div>
                        {order?.customer?.address && (
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-600 dark:text-stone-300">Shipped To:</span>
                                <span className="font-medium text-[#1a1a1a] dark:text-white">{order.customer.city}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="space-y-3 pt-4 text-center">
                <Link href="/shop">
                    <Button className="w-full h-14 bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-lg">
                        Continue Shopping
                    </Button>
                </Link>
                <Link href="/help/track-order" className="text-xs font-bold uppercase tracking-widest text-[#AB462F] hover:underline block mt-4 flex items-center justify-center gap-1">
                    Track Order Status <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    </div>
  )
}

// 2. Export the wrapper component with the Suspense boundary
export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#AB462F]" /></div>}>
            <OrderSuccessContent />
        </Suspense>
    )
}