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
  Search,
  ArrowRight
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

// --- TRACKING STEPS CONFIGURATION ---
const TRACKING_STEPS = [
  { 
    id: "placed", 
    label: "Order Placed", 
    desc: "We have received your order.",
    icon: FileText 
  },
  { 
    id: "paid", 
    label: "Payment Confirmed", 
    desc: "Your payment has been verified.",
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
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            // Optional: Filter by email for security if needed
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
            // FALLBACK FOR DEMO: If not found in DB, verify format and mock it
            if(orderId.startsWith("ORD-")) {
                 setTimeout(() => {
                    setFoundOrder({
                        id: orderId,
                        status: "Packed", // Mock status
                        date: new Date(),
                        total: 1299,
                        customer: { firstName: "Guest", lastName: "User", address: "Makati City" }
                    })
                    toast({ title: "Demo Mode", description: "Showing sample tracking data." })
                 }, 1000)
            } else {
                toast({ title: "Not Found", description: "Order ID does not match our records.", variant: "destructive" })
            }
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
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        
        {/* --- Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md mb-6">
             <Search className="w-3 h-3 text-[#AB462F]" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300">Order Status</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 text-[#1a1a1a] dark:text-white leading-[0.9]">
            Track Your <br/> <span className="font-serif italic font-normal lowercase tracking-normal text-stone-500 dark:text-stone-400">package</span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 font-light max-w-lg mx-auto leading-relaxed">
            Enter your order details below to see real-time updates on your delivery.
          </p>
        </motion.div>

        {/* --- INPUT FORM --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#EFECE5] dark:bg-white/5 p-10 rounded-[40px] shadow-sm border border-stone-200 dark:border-white/10 mb-16"
        >
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Order ID</label>
                      <input 
                        type="text" 
                        placeholder="ORD-2025-..." 
                        value={orderId} 
                        onChange={(e) => setOrderId(e.target.value)} 
                        className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-[#AB462F] focus:ring-1 focus:ring-[#AB462F] transition-all font-mono uppercase" 
                        required 
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-[#AB462F] focus:ring-1 focus:ring-[#AB462F] transition-all" 
                        required 
                      />
                  </div>
              </div>
              
              <div className="pt-2">
                <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full h-14 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.2em] uppercase text-xs shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-2">Track Now <ArrowRight className="w-4 h-4" /></span>}
                </Button>
              </div>
            </form>
        </motion.div>

        {/* --- TRACKING TIMELINE RESULT --- */}
        {foundOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden border border-white/60 dark:border-white/10"
          >
            {/* Status Header */}
            <div className="bg-[#AB462F] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Current Status</p>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{foundOrder.status}</h2>
               </div>
               <div className="relative z-10 text-left md:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold font-serif italic">₱{foundOrder.total.toLocaleString()}</p>
               </div>
               
               {/* Decorative Circle */}
               <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Address Bar */}
            <div className="px-8 py-6 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-white/5 flex gap-4 items-center">
               <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shrink-0 text-[#AB462F]">
                   <MapPin className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Delivery Address</p>
                  <p className="text-sm font-bold text-[#1a1a1a] dark:text-white">
                    {foundOrder.customer?.firstName} {foundOrder.customer?.lastName} <span className="font-normal text-stone-500">— {foundOrder.customer?.city}</span>
                  </p>
               </div>
            </div>

            {/* Vertical Timeline */}
            <div className="p-8 md:p-12 relative">
                {/* Connecting Line (Background) */}
                <div className="absolute left-[62px] md:left-[78px] top-12 bottom-12 w-0.5 bg-stone-200 dark:bg-stone-800" />
                
                {/* Connecting Line (Progress) */}
                <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(activeStepIndex / (TRACKING_STEPS.length - 1)) * 85}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                    className="absolute left-[62px] md:left-[78px] top-12 w-0.5 bg-[#AB462F]" 
                />

                <div className="space-y-10 relative">
                   {TRACKING_STEPS.map((step, index) => {
                      const isCompleted = index <= activeStepIndex;
                      const isCurrent = index === activeStepIndex;
                      
                      return (
                        <motion.div 
                            key={step.id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: isCompleted ? 1 : 0.4, x: 0 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="flex gap-6 md:gap-8 relative"
                        >
                            {/* Icon Circle */}
                            <div className={`
                                relative z-10 w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-500 shadow-sm
                                ${isCompleted 
                                    ? 'bg-[#AB462F] border-white dark:border-[#1a1a1a] text-white shadow-[#AB462F]/20' 
                                    : 'bg-white dark:bg-stone-800 border-stone-100 dark:border-stone-700 text-stone-300'}
                            `}>
                                <step.icon className="w-7 h-7" />
                            </div>

                            {/* Text Info */}
                            <div className="pt-3">
                                <h4 className={`text-lg font-bold uppercase tracking-tight ${isCurrent ? 'text-[#AB462F]' : 'text-[#1a1a1a] dark:text-white'}`}>
                                    {step.label}
                                </h4>
                                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                                    {isCurrent ? step.desc : (isCompleted ? "Completed" : "Pending")}
                                </p>
                                {isCompleted && index === 0 && (
                                   <p className="text-[10px] font-bold text-stone-300 mt-2 uppercase tracking-wider">{foundOrder.date.toLocaleDateString()}</p>
                                )}
                            </div>
                        </motion.div>
                      )
                   })}
                </div>
            </div>
            
            {/* Footer */}
            <div className="bg-stone-50 dark:bg-white/5 p-6 border-t border-stone-100 dark:border-white/5 flex justify-between items-center text-xs text-stone-500">
               <span className="font-bold uppercase tracking-widest">Logistics Partner</span>
               <div className="flex items-center gap-2 font-bold text-[#1a1a1a] dark:text-white">
                  <Truck className="w-4 h-4 text-[#AB462F]" /> Standard Delivery (J&T)
               </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  )
}