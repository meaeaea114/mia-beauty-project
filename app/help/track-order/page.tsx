"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  MapPin, 
  Loader2,
  Search
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

// --- 1. TRACKING STEPS CONFIGURATION ---
const TRACKING_STEPS = [
  { 
    id: "placed", 
    label: "Order Placed", 
    desc: "Your order has been created.",
    icon: FileText 
  },
  { 
    id: "paid", 
    label: "Payment Confirmed", 
    desc: "We have received your payment.",
    icon: CreditCard 
  },
  { 
    id: "packed", 
    label: "Packed & Ready", 
    desc: "Seller has packed your parcel.",
    icon: Package 
  },
  { 
    id: "shipped", 
    label: "On the Way", 
    desc: "Parcel is with the delivery courier.",
    icon: Truck 
  },
  { 
    id: "delivered", 
    label: "Delivered", 
    desc: "Package delivered successfully.",
    icon: CheckCircle2 
  }
]

export default function TrackOrderPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [foundOrder, setFoundOrder] = useState<any>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFoundOrder(null)

    try {
        // --- FIX: Use .maybeSingle() instead of .single() to prevent 406 Error ---
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            // Optional: You can also filter by email for security
            // .eq('customer_email', email) 
            .maybeSingle() 

        if (error) throw error

        if (data) {
            setFoundOrder({
                id: data.id,
                status: data.status || "Placed",
                date: new Date(data.created_at),
                total: data.total_amount,
                customer: data.customer_details || {}
            })
            toast({ title: "Order Found", description: "Tracking details retrieved." })
        } else {
            toast({ title: "Not Found", description: "Order ID does not match our records.", variant: "destructive" })
        }
    } catch (e: any) {
        console.error(e)
        toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
        setIsLoading(false)
    }
  }

  // Helper: Find which step is active based on status string
  const getCurrentStepIndex = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("deliver") || s.includes("complete")) return 4
    if (s.includes("ship") || s.includes("transit")) return 3
    if (s.includes("pack") || s.includes("process")) return 2
    if (s.includes("paid") || s.includes("confirm")) return 1
    return 0 // Default to "Placed"
  }

  const activeStepIndex = foundOrder ? getCurrentStepIndex(foundOrder.status) : 0

  return (
    // MODIFIED: Changed solid background to transparent
    <div className="w-full bg-transparent min-h-screen pt-32 pb-20 font-sans text-[#1a1a1a]">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Track Order</h1>
          <p className="text-stone-500">Enter your order ID to see real-time status.</p>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 mb-8">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Order ID</label>
                      <input 
                        type="text" 
                        placeholder="ORD-2025-..." 
                        value={orderId} 
                        onChange={(e) => setOrderId(e.target.value)} 
                        className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-stone-800 focus:border-[#AB462F] rounded-lg px-4 py-3 text-sm outline-none font-mono uppercase" 
                        required 
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-stone-800 focus:border-[#AB462F] rounded-lg px-4 py-3 text-sm outline-none" 
                        required 
                      />
                  </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-12 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.15em] uppercase text-xs shadow-lg transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-2"><Search className="w-4 h-4"/> Track Now</span>}
              </Button>
            </form>
        </div>

        {/* SHOPEE-STYLE TIMELINE RESULT */}
        {foundOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 rounded-2xl shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800"
          >
            {/* Status Header */}
            <div className="bg-[#AB462F] p-6 text-white flex justify-between items-center relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Status</p>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{foundOrder.status}</h2>
               </div>
               <div className="relative z-10 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total</p>
                  <p className="text-xl font-bold">₱{foundOrder.total.toLocaleString()}</p>
               </div>
               {/* Decorative bg circle */}
               <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Address */}
            <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-white/5 flex gap-4 items-start">
               <MapPin className="w-5 h-5 text-[#AB462F] mt-1 shrink-0" />
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Delivery Address</p>
                  <p className="text-sm font-bold text-[#1a1a1a] dark:text-white">
                    {foundOrder.customer?.firstName} {foundOrder.customer?.lastName}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {foundOrder.customer?.address}, {foundOrder.customer?.city}
                  </p>
               </div>
            </div>

            {/* Vertical Timeline Container */}
            <div className="p-8 relative">
                {/* Grey Line Background */}
                <div className="absolute left-[54px] top-10 bottom-10 w-0.5 bg-stone-100 dark:bg-stone-800" />
                
                {/* Colored Progress Line */}
                <div 
                    className="absolute left-[54px] top-10 w-0.5 bg-[#AB462F] transition-all duration-1000 ease-out" 
                    style={{ height: `${(activeStepIndex / (TRACKING_STEPS.length - 1)) * 80}%` }}
                />

                <div className="space-y-8 relative">
                   {TRACKING_STEPS.map((step, index) => {
                      const isCompleted = index <= activeStepIndex;
                      const isCurrent = index === activeStepIndex;
                      
                      return (
                        <div key={step.id} className={`flex gap-6 relative ${isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                            
                            {/* Icon Circle */}
                            <div className={`
                                relative z-10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-500
                                ${isCompleted 
                                    ? 'bg-[#AB462F] border-white dark:border-[#1a1a1a] text-white shadow-lg shadow-[#AB462F]/20' 
                                    : 'bg-stone-100 dark:bg-stone-800 border-white dark:border-[#1a1a1a] text-stone-400'}
                            `}>
                                <step.icon className="w-6 h-6" />
                            </div>

                            {/* Text Info */}
                            <div className="pt-2">
                                <h4 className={`text-base font-bold uppercase tracking-tight ${isCurrent ? 'text-[#AB462F]' : 'text-[#1a1a1a] dark:text-white'}`}>
                                    {step.label}
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-[240px] leading-relaxed">
                                    {isCurrent ? step.desc : (isCompleted ? "Completed" : "Pending")}
                                </p>
                                {isCompleted && index === 0 && (
                                   <p className="text-[10px] text-stone-400 mt-1 font-mono">{foundOrder.date.toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>
                      )
                   })}
                </div>
            </div>
            
            {/* Courier Footer */}
            <div className="bg-stone-50 dark:bg-white/5 p-4 flex justify-between items-center text-xs border-t border-stone-200 dark:border-stone-800 text-stone-500">
               <span className="font-bold uppercase tracking-widest">Logistics Partner</span>
               <div className="flex items-center gap-2 font-bold text-[#1a1a1a] dark:text-white">
                  <Truck className="w-4 h-4" /> Standard Delivery (J&T)
               </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  )
}