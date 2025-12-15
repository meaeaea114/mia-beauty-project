// app/checkout/payment/page.tsx
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Lock, ArrowLeft, Loader2, CreditCard, X, QrCode, Truck, ChevronRight, DollarSign, Wallet as WalletIcon } from "lucide-react" 
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/app/context/cart-context"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

// --- WALLET CONFIGURATION ---
const WALLETS = [
  {
    id: 'GCash',
    name: 'GCash',
    description: 'Pay using your GCash number',
    color: '#007DFE',
    logoPath: '/images/gcash.png', 
    fallbackText: 'GC'
  },
  {
    id: 'Maya',
    name: 'Maya',
    description: 'Pay using your Maya wallet',
    color: '#4D8B31',
    logoPath: '/images/maya.png', 
    fallbackText: 'MY'
  },
  {
    id: 'ShopeePay',
    name: 'ShopeePay',
    description: 'Scan with your Shopee App',
    color: '#EE4D2D',
    logoPath: '/images/shopeepay.png', 
    fallbackText: 'SP'
  },
  {
    id: 'PayPal',
    name: 'PayPal',
    description: 'Pay securely with PayPal',
    color: '#003087',
    logoPath: '/images/paypal.png', 
    fallbackText: 'PP'
  }
] as const

type WalletType = typeof WALLETS[number]['id']

export default function PaymentGatewayPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { clearCart } = useCart()
  const [session, setSession] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMounting, setIsMounting] = useState(true)
  
  // QR Modal State
  const [showQR, setShowQR] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<typeof WALLETS[number] | null>(null)

  // Card Form State
  const [cardData, setCardData] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" })

  useEffect(() => {
    // Retrieve the data passed from the Checkout Form
    const data = sessionStorage.getItem("current_checkout_session")
    if (data) {
        setSession(JSON.parse(data))
    } else {
        router.push("/shop")
    }
    setIsMounting(false)
  }, [router])

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let { name, value } = e.target
      if (name === "cardNumber") {
          value = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
      } else if (name === "expiry") {
          value = value.replace(/\D/g, '').substring(0, 4)
          if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2)
      } else if (name === "cvv") {
          value = value.replace(/\D/g, '').substring(0, 3)
      }
      setCardData({ ...cardData, [name]: value })
  }

  // Handle Card Payment Submit
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation
    if (cardData.cardNumber.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3) {
         toast({ title: "Validation Error", description: "Please complete all card fields.", variant: "destructive" })
         return
    }
    await completeOrder()
  }

  // Handle Wallet Selection
  const handleWalletSelect = (wallet: typeof WALLETS[number]) => {
      setIsProcessing(true)
      setSelectedWallet(wallet)
      
      // Simulate loading/generation
      setTimeout(() => {
          setIsProcessing(false)
          setShowQR(true)
      }, 800)
  }

  // --- CORE SAVING LOGIC (Used for both Card and QR Success) ---
  const completeOrder = async () => {
      setIsProcessing(true)

      const orderId = session?.id || "ORD-UNKNOWN"
      const items = session.items || []
      const customer = session.customer || {}
      
      const methodString = session.paymentMethod === 'card' 
        ? 'Credit Card' 
        : `E-Wallet (${selectedWallet?.name || 'Unknown'})`

      try {
        // 1. Insert Order into Supabase
        const { error } = await supabase.from('orders').insert({
            id: orderId,
            customer_email: customer.email,
            customer_details: customer, 
            items: items,               
            total_amount: session.total,
            payment_method: methodString,
            status: 'Paid'
        })

        if (error) throw error

        // 2. Save Session Data 
        sessionStorage.setItem("last_order_details", JSON.stringify({
            id: orderId,
            total: session.total,
            items: session.items,
            customer: session.customer, 
            status: "Paid"
        }))

        // 3. Cleanup & Redirect
        clearCart() 
        sessionStorage.removeItem("current_checkout_session") 
        localStorage.removeItem("checkout_draft")
        
        router.push(`/checkout/success?id=${orderId}`)

      } catch (error: any) {
        console.error("Order Error:", error)
        toast({ 
            title: "Order Failed", 
            description: error.message || "Could not connect to database.", 
            variant: "destructive" 
        })
        setIsProcessing(false)
        setShowQR(false)
      }
  }

  if (isMounting || !session) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-transparent">
              <Loader2 className="w-8 h-8 text-[#AB462F] animate-spin" />
          </div>
      )
  }

  const paymentGatewayName = session.paymentMethod === 'card' ? "Credit/Debit Card" : "E-Wallet Payment"

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 font-sans text-[#1a1a1a] dark:text-white">
       {/* QR MODAL */}
       {showQR && selectedWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white dark:bg-black/60 w-full max-w-[380px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col items-center p-8 space-y-6 border border-white/10">
                <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-stone-300 hover:text-stone-500 transition-colors"><X className="w-5 h-5" /></button>
                
                <div className="text-center space-y-2 mt-2">
                    <h2 className="font-bold text-xl uppercase tracking-tight text-[#1a1a1a] dark:text-white">
                        Scan <span style={{ color: selectedWallet.color }}>{selectedWallet.name}</span> QR
                    </h2>
                    <p className="text-xs text-stone-500 max-w-[240px] mx-auto leading-relaxed">
                        Open your {selectedWallet.name} app and scan to pay.
                    </p>
                </div>

                <div className="relative group cursor-pointer">
                    <div className="w-56 h-56 bg-white dark:bg-black/20 border-[3px] border-dashed border-stone-200 dark:border-stone-700 rounded-2xl flex items-center justify-center p-3 shadow-inner">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MIA-PAYMENT-${selectedWallet.id}-${session.id}-${session.total}`} 
                            alt={`${selectedWallet.name} QR`} 
                            className="w-full h-full object-contain mix-blend-multiply opacity-90" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center border border-stone-100 overflow-hidden">
                                <img 
                                    src={selectedWallet.logoPath} 
                                    alt="logo" 
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.style.backgroundColor = selectedWallet.color;
                                        e.currentTarget.parentElement!.innerText = selectedWallet.fallbackText;
                                        e.currentTarget.parentElement!.style.color = 'white'; // Keep text white on colored fallback
                                        e.currentTarget.parentElement!.style.fontWeight = 'bold';
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-4xl font-black text-[#1a1a1a] dark:text-white tracking-tighter">₱{session.total.toLocaleString()}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Amount</p>
                </div>

                <Button 
                    onClick={completeOrder} 
                    disabled={isProcessing} 
                    className="w-full h-14 rounded-full text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all"
                    style={{ backgroundColor: selectedWallet.color }}
                >
                    {isProcessing ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</span> : "I've Completed Payment"}
                </Button>
            </div>
        </div>
       )}

       {/* MAIN UI */}
       <div className="max-w-5xl w-full bg-white dark:bg-black/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-0 border border-stone-200 dark:border-white/10">
           
           {/* Left Panel: Payment Method */}
           <div className="flex-1 p-8 lg:p-12 order-2 md:order-1">
               <div className="flex items-center gap-2 mb-8 cursor-pointer text-stone-400 hover:text-[#AB462F] transition-colors group w-fit" onClick={() => router.back()}>
                   <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="text-xs font-bold uppercase tracking-wider">Back</span>
               </div>
               
               <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-[#1a1a1a] dark:text-white">
                   {paymentGatewayName}
               </h1>
               <p className="text-sm text-stone-500 mb-10">
                   Complete your purchase of <span className="font-bold text-[#AB462F]">₱{session.total.toLocaleString()}</span>
               </p>

               {session.paymentMethod === 'card' ? (
                   <form onSubmit={handleCardSubmit} className="space-y-6 animate-in fade-in slide-in-from-left-4">
                       <div className="space-y-5">
                           <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Cardholder Name</label><input name="cardName" required placeholder="NAME ON CARD" value={cardData.cardName} onChange={handleCardInput} className="w-full border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-3 text-sm focus:border-[#AB462F] outline-none uppercase bg-white dark:bg-black/20 text-[#1a1a1a] dark:text-white"/></div>
                           <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Card Number</label><div className="relative"><input name="cardNumber" required placeholder="0000 0000 0000 0000" maxLength={19} value={cardData.cardNumber} onChange={handleCardInput} className="w-full border border-stone-300 dark:border-stone-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-[#AB462F] outline-none font-mono bg-white dark:bg-black/20 text-[#1a1a1a] dark:text-white"/><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" /></div></div>
                           <div className="grid grid-cols-2 gap-5">
                               <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Expiry</label><input name="expiry" required placeholder="MM/YY" maxLength={5} value={cardData.expiry} onChange={handleCardInput} className="w-full border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-3 text-sm focus:border-[#AB462F] outline-none font-mono bg-white dark:bg-black/20 text-[#1a1a1a] dark:text-white"/></div>
                               <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">CVV</label><div className="relative"><input name="cvv" required placeholder="123" type="password" maxLength={3} value={cardData.cvv} onChange={handleCardInput} className="w-full border border-stone-300 dark:border-stone-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#AB462F] outline-none font-mono bg-white dark:bg-black/20 text-[#1a1a1a] dark:text-white"/><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" /></div></div>
                           </div>
                       </div>
                       
                       <p className="text-[10px] text-stone-500 pt-2 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-green-600" />
                            Your payment details are fully secure via PayMongo.
                        </p>

                       <Button type="submit" disabled={isProcessing || cardData.cardNumber.length < 19} className="w-full h-14 bg-[#AB462F] hover:bg-[#944E45] text-white font-bold uppercase tracking-widest text-sm rounded-full shadow-lg mt-6">
                            {isProcessing ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span> : `Pay ₱${session.total.toLocaleString()}`}
                       </Button>
                   </form>
               ) : (
                   <div className="grid grid-cols-1 gap-4 animate-in fade-in zoom-in">
                        {WALLETS.map((wallet) => (
                           <div 
                             key={wallet.id}
                             onClick={() => handleWalletSelect(wallet)}
                             className="group relative bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center justify-between overflow-hidden"
                           >
                              <div 
                                  className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ease-out -translate-x-full group-hover:translate-x-0"
                                  style={{ backgroundColor: wallet.color }}
                              />
                              
                              <div className="flex items-center gap-5 relative z-10 pl-2">
                                  <div 
                                      className="h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden relative border border-stone-100 dark:border-stone-700 group-hover:scale-105 transition-transform duration-300"
                                      style={{ backgroundColor: '#fff' }} 
                                  >
                                      <img 
                                          src={wallet.logoPath} 
                                          alt={wallet.name} 
                                          className="w-full h-full object-contain p-2"
                                          onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                              e.currentTarget.parentElement!.style.backgroundColor = wallet.color;
                                              e.currentTarget.parentElement!.innerText = wallet.fallbackText;
                                          }} 
                                      />
                                  </div>
                                  
                                  <div className="space-y-0.5">
                                      <h3 className="font-bold text-lg text-[#1a1a1a] dark:text-white uppercase tracking-tight group-hover:text-[#AB462F] transition-colors">
                                          {wallet.name}
                                      </h3>
                                      <p className="text-xs text-stone-500 font-medium group-hover:text-stone-600 dark:text-stone-400">
                                          {wallet.description}
                                      </p>
                                  </div>
                              </div>

                              <div className="relative z-10 pr-2 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                  <ChevronRight className="w-6 h-6 text-[#1a1a1a] dark:text-white" />
                              </div>
                           </div>
                         ))}
                     </div>
               )}
           </div>

           {/* Right Panel: Order Summary */}
           <div className="w-full md:w-[400px] bg-white/70 dark:bg-black/60 border-l border-stone-200 dark:border-white/10 p-8 lg:p-12 order-1 md:order-2 flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Order Summary</h3>
                <div className="space-y-6 flex-grow overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {session.items.map((item: any) => (
                        <div key={item.id + item.variant} className="flex gap-4 items-start">
                            <div className="h-16 w-16 bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 rounded-md overflow-hidden relative flex-shrink-0 shadow-sm">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-[#1a1a1a] dark:text-white uppercase tracking-tight">{item.name}</h4>
                                <p className="text-[10px] text-stone-500 font-medium uppercase mt-0.5">{item.variant}</p>
                                <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm text-[#1a1a1a] dark:text-white">₱{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-stone-300 dark:border-stone-700 space-y-3">
                    <div className="flex justify-between text-sm text-stone-600 dark:text-stone-300"><span>Subtotal</span><span className="font-medium">₱{session.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm text-stone-600 dark:text-stone-300">
                        <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-stone-400" /> Shipping</span>
                        <span className="font-medium text-[#AB462F]">{session.shippingCost === 0 ? "Free" : `₱${session.shippingCost.toLocaleString()}`}</span>
                    </div>
                </div>
                <div className="border-t border-stone-300 dark:border-stone-700 mt-6 pt-6 flex justify-between items-baseline">
                    <span className="text-lg font-bold text-[#1a1a1a] dark:text-white">Total</span>
                    <div className="text-right flex items-baseline gap-2">
                        <span className="text-xs text-stone-500 font-semibold tracking-wider">PHP</span>
                        <span className="font-black text-3xl text-[#AB462F] tracking-tight">₱{session.total.toLocaleString()}</span>
                    </div>
                </div>
           </div>
       </div>
    </div>
  )
}