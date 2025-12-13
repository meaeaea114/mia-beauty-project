"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useCart } from "@/app/context/cart-context"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, ArrowLeft, Loader2 } from "lucide-react"
import { Suspense, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase" // Import Supabase
import { useToast } from "@/hooks/use-toast"

function CodConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const { items, subtotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  // Get data from URL
  const email = searchParams.get("email") || ""
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const address = searchParams.get("address")
  const city = searchParams.get("city")
  const postal = searchParams.get("postal")
  const mobile = searchParams.get("mobile")
  const region = searchParams.get("region")
  const province = searchParams.get("province")

  // Re-calculate shipping (Same logic as checkout)
  const shippingCost = useMemo(() => {
      if (!region) return 0
      if (region === 'NCR') return subtotal > 1500 ? 0 : 100
      if (['I', 'II', 'III', 'IV-A', 'IV-B', 'V', 'CAR'].includes(region)) return 150
      return 200
  }, [region, subtotal])

  const total = subtotal + shippingCost

  const handleFinalizeOrder = async () => {
    setIsProcessing(true)

    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`
    
    // Construct the customer details object
    const customerDetails = {
        firstName,
        lastName,
        email,
        address,
        city,
        province,
        region,
        postalCode: postal,
        phone: mobile
    }

    try {
        // 1. INSERT INTO SUPABASE
        const { error } = await supabase.from('orders').insert({
            id: orderId,
            customer_email: email,
            customer_details: customerDetails,
            items: items,
            total_amount: total,
            payment_method: 'Cash on Delivery',
            status: 'Pending' // Default status for COD
        })

        if (error) throw error

        // 2. Save to Session (for Success page fallback)
        sessionStorage.setItem("last_order_details", JSON.stringify({
            id: orderId,
            total: total,
            items: items,
            customer: customerDetails,
            status: "Pending"
        }))

        // 3. Cleanup & Redirect
        clearCart()
        router.push(`/checkout/success?id=${orderId}`)

    } catch (error: any) {
        console.error("Order Error:", error)
        toast({ 
            title: "Order Failed", 
            description: "Could not save your order. Please try again.", 
            variant: "destructive" 
        })
        setIsProcessing(false)
    }
  }

  if (!items) return null;

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-28 pb-20 px-4 font-sans bg-transparent transition-all duration-700">
      <div className="max-w-2xl w-full">
        
        <div className="rounded-[40px] bg-white/60 dark:bg-black/60 border border-white/60 dark:border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
            
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
                    <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500">1. Delivery Details</h2>
                    <div className="flex gap-4 items-start p-6 bg-white/40 dark:bg-white/5 rounded-3xl border border-stone-100 dark:border-white/5 relative group">
                        <div className="bg-[#AB462F]/10 p-3 rounded-full text-[#AB462F]">
                             <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-xl leading-tight text-stone-800 dark:text-white">{firstName} {lastName}</p>
                            <p className="text-stone-600 dark:text-stone-300 mt-1">{address}</p>
                            <p className="text-stone-500 text-sm">{city}, {province}</p>
                            
                            <div className="flex items-center gap-2 mt-3 text-sm text-stone-500 font-mono bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full w-fit">
                                <Phone className="w-3 h-3" /> {mobile}
                            </div>
                        </div>
                        <button onClick={() => router.back()} className="absolute top-6 right-6 text-xs font-bold text-stone-400 hover:text-[#AB462F] uppercase tracking-wider transition-colors">Change</button>
                    </div>
                </div>

                {/* 2. ORDER SUMMARY */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500">2. Order Summary</h2>
                    <div className="bg-stone-50/50 dark:bg-black/20 rounded-3xl p-6 space-y-4 border border-stone-100 dark:border-white/5">
                        {items.map((item: any) => (
                             <div key={`${item.id}-${item.variant}`} className="flex gap-4 items-center border-b border-dashed border-stone-200 dark:border-white/10 last:border-0 pb-3 last:pb-0">
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
                        
                        <div className="pt-4 mt-2 space-y-2">
                            <div className="flex justify-between text-xs text-stone-500"><span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-xs text-stone-500"><span>Shipping ({region})</span><span className="text-[#AB462F] font-medium">{shippingCost === 0 ? "Free" : `₱${shippingCost}`}</span></div>
                            <div className="flex justify-between items-end pt-4 border-t border-stone-200 dark:border-white/10">
                                <div className="text-left"><p className="text-xs text-stone-500">Payment Method</p><p className="font-bold text-[#AB462F] uppercase text-xs tracking-wider">Cash on Delivery</p></div>
                                <div className="text-right"><span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Total to Pay</span><span className="font-black text-3xl text-stone-900 dark:text-white">₱{total.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. ACTIONS */}
                <div className="pt-2 space-y-3">
                    <Button 
                        onClick={handleFinalizeOrder}
                        disabled={isProcessing}
                        className="w-full h-14 rounded-full text-sm font-bold tracking-[0.2em] uppercase bg-stone-900 dark:bg-white text-white dark:text-black hover:bg-[#AB462F] dark:hover:bg-[#AB462F] hover:text-white dark:hover:text-white shadow-xl transition-all duration-300"
                    >
                        {isProcessing ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing Order...</span> : "Complete Order"}
                    </Button>
                    
                    <button onClick={() => router.back()} className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors">
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