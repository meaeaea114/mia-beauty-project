"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useCart } from "@/app/context/cart-context"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { Suspense, useMemo } from "react"

function CodConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // FIXED: Using 'items' and 'subtotal' to match your CartContext structure
  // Note: If 'clearCart' is named differently in your context (e.g. resetCart), update it here.
  const { items, subtotal, clearCart } = useCart()

  // Get data from URL
  const address = searchParams.get("address")
  const city = searchParams.get("city")
  const postal = searchParams.get("postal")
  const mobile = searchParams.get("mobile")
  const region = searchParams.get("region")

  // --- REPLICATING YOUR SHIPPING LOGIC ---
  const shippingCost = useMemo(() => {
      if (!region) return 0
      // NCR: Free over 1500, otherwise 100
      if (region === 'NCR') {
          return subtotal > 1500 ? 0 : 100
      }
      // Luzon Provinces: 150
      if (['I', 'II', 'III', 'IV-A', 'IV-B', 'V', 'CAR'].includes(region)) {
          return 150
      }
      // Visayas & Mindanao: 200
      return 200
  }, [region, subtotal])

  const total = subtotal + shippingCost

  const handleFinalizeOrder = () => {
    // 1. Generate Order ID
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`
    
    // 2. Clear Cart (Ensure this function exists in your context, or remove if not needed)
    if (clearCart) clearCart()
    
    // 3. Redirect to Success
    // Using your existing success page structure
    router.push(`/checkout/success?id=${orderId}`) 
  }

  // Guard clause if context is empty (optional, prevents crash if refreshed)
  if (!items) return null;

  return (
    // MODIFIED: Removed explicit bg image/cover classes to rely on transparent body
    <div className="w-full min-h-screen flex items-center justify-center pt-28 pb-20 px-4 font-sans 
      bg-transparent transition-all duration-700"
    >
      <div className="max-w-2xl w-full">
        
        {/* GLASSMORPHISM CARD */}
        <div className="rounded-[40px] 
            bg-white/60 dark:bg-black/60 
            border border-white/60 dark:border-white/10 
            backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="bg-[#AB462F] p-8 text-center">
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3">
                   Confirm Order
                </h1>
                <p className="text-white/80 text-xs uppercase tracking-widest mt-2">Cash on Delivery Verification</p>
            </div>

            <div className="p-8 md:p-12 space-y-10">

                {/* 1. CONFIRM ADDRESS */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500">
                        1. Is this address correct?
                    </h2>

                    <div className="flex gap-4 items-start p-6 bg-white/40 dark:bg-white/5 rounded-3xl border border-stone-100 dark:border-white/5 relative group">
                        <div className="bg-[#AB462F]/10 p-3 rounded-full text-[#AB462F]">
                             <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-xl leading-tight text-stone-800 dark:text-white">{address}</p>
                            <p className="text-stone-600 dark:text-stone-300 mt-1">{city}, {region} {postal}</p>
                            
                            <div className="flex items-center gap-2 mt-3 text-sm text-stone-500 font-mono bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full w-fit">
                                <Phone className="w-3 h-3" /> {mobile}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button 
                            onClick={() => router.back()}
                            className="absolute top-6 right-6 text-xs font-bold text-stone-400 hover:text-[#AB462F] uppercase tracking-wider transition-colors"
                        >
                            Change
                        </button>
                    </div>
                </div>

                {/* 2. ORDER SUMMARY */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500">
                        2. Order Summary
                    </h2>

                    <div className="bg-stone-50/50 dark:bg-black/20 rounded-3xl p-6 space-y-4 border border-stone-100 dark:border-white/5">
                        {items.map((item: any) => (
                             <div key={item.id} className="flex gap-4 items-center border-b border-dashed border-stone-200 dark:border-white/10 last:border-0 pb-3 last:pb-0">
                                 <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1">
                                     <p className="font-bold text-sm uppercase text-stone-800 dark:text-white">{item.name}</p>
                                     <p className="text-[10px] text-stone-500 uppercase tracking-wider">{item.variant || 'Standard'}</p>
                                 </div>
                                 <div className="text-right">
                                     <p className="font-bold text-sm text-stone-800 dark:text-white">₱{(item.price * item.quantity).toLocaleString()}</p>
                                     <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                                 </div>
                             </div>
                        ))}
                        
                        {/* Totals */}
                        <div className="pt-4 mt-2 space-y-2">
                            <div className="flex justify-between text-xs text-stone-500">
                                <span>Subtotal</span>
                                <span>₱{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-stone-500">
                                <span>Shipping ({region})</span>
                                <span className="text-[#AB462F] font-medium">{shippingCost === 0 ? "Free" : `₱${shippingCost}`}</span>
                            </div>

                            <div className="flex justify-between items-end pt-4 border-t border-stone-200 dark:border-white/10">
                                <div className="text-left">
                                    <p className="text-xs text-stone-500">Payment Method</p>
                                    <p className="font-bold text-[#AB462F] uppercase text-xs tracking-wider">Cash on Delivery</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Total to Pay</span>
                                    <span className="font-black text-3xl text-stone-900 dark:text-white">₱{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. ACTIONS */}
                <div className="pt-2 space-y-3">
                    <Button 
                        onClick={handleFinalizeOrder}
                        className="w-full h-14 rounded-full text-sm font-bold tracking-[0.2em] uppercase bg-stone-900 dark:bg-white text-white dark:text-black hover:bg-[#AB462F] dark:hover:bg-[#AB462F] hover:text-white dark:hover:text-white shadow-xl transition-all duration-300"
                    >
                        Complete Order
                    </Button>
                    
                    <button 
                        onClick={() => router.back()} 
                        className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" /> Back to Edit
                    </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  )
}

export default function CodConfirmPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CodConfirmContent />
        </Suspense>
    )
}