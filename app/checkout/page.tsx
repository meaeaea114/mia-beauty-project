"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { useCart } from "@/app/context/cart-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Truck } from "lucide-react" 
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// --- EXPANDED DATASET FOR PHILIPPINE CITIES ---
const ADDRESS_DATA = {
    regions: [
        { name: "National Capital Region (NCR)", code: "NCR" },
        { name: "CALABARZON (Region IV-A)", code: "IV-A" },
        { name: "Central Luzon (Region III)", code: "III" },
        { name: "Central Visayas (Region VII)", code: "VII" },
        // ... (Keep existing regions)
    ],
    provinces: {
        "NCR": ["Metro Manila"],
        "IV-A": ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"],
        // ... (Keep existing provinces)
    },
    cities: {
        "Metro Manila": ["Manila", "Quezon City", "Makati", "Taguig"],
        "Batangas": ["Batangas City", "Lipa City", "Tanauan City", "Sto. Tomas"],
        // ... (Keep existing cities)
    }
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card") 
  const [mounted, setMounted] = useState(false)
  
  const [user, setUser] = useState<{name: string, email: string, id?: string} | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]) 
  
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "", 
    address: "", barangay: "", postalCode: "", phone: ""
  })

  // --- DYNAMIC SHIPPING LOGIC ---
  const getShippingCost = useMemo(() => {
      return () => {
        if (!selectedRegion) return null
        if (selectedRegion === 'NCR') return subtotal > 1500 ? 0 : 100
        if (['I', 'II', 'III', 'IV-A', 'IV-B', 'V', 'CAR'].includes(selectedRegion)) return 150
        return 200
      }
  }, [selectedRegion, subtotal])

  const shippingCost = getShippingCost()
  const total = subtotal + (shippingCost || 0)

  // --- INITIAL LOAD ---
  useEffect(() => {
    setMounted(true)

    const initCheckout = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
            const currentUser = session.user
            setUser({ 
                name: currentUser.user_metadata.first_name || "", 
                email: currentUser.email!,
                id: currentUser.id
            })
            setFormData(prev => ({ ...prev, email: currentUser.email! }))

            // FETCH SAVED ADDRESSES
            const { data: addresses } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('is_default', { ascending: false })
            
            if (addresses && addresses.length > 0) {
                setSavedAddresses(addresses)
                const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0]
                fillAddressForm(defaultAddr)
            } 
            else {
                // Fallback to last order address
                const { data: lastOrder } = await supabase
                    .from('orders')
                    .select('customer_details')
                    .eq('customer_email', currentUser.email)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()

                if (lastOrder?.customer_details) {
                    fillAddressForm(lastOrder.customer_details)
                }
            }
        } else {
            // Guest Logic
            const draft = localStorage.getItem("checkout_draft")
            if (draft) {
                try {
                    const parsed = JSON.parse(draft)
                    setFormData(parsed)
                    if(parsed.region) setSelectedRegion(parsed.region)
                    if(parsed.region && parsed.province) setSelectedProvince(parsed.province)
                    if(parsed.region && parsed.province && parsed.city) setSelectedCity(parsed.city)
                } catch(e) {}
            }
        }
    }

    initCheckout()
  }, [])

  const fillAddressForm = (data: any) => {
      const firstName = data.first_name || data.firstName || ""
      const lastName = data.last_name || data.lastName || ""
      const phone = data.phone || ""
      const address = data.address || ""
      const barangay = data.barangay || ""
      const postalCode = data.postal_code || data.postalCode || ""
      const region = data.region || ""
      const province = data.province || ""
      const city = data.city || ""

      setFormData(prev => ({
          ...prev, firstName, lastName, phone, address, barangay, postalCode
      }))

      if (region) setSelectedRegion(region)
      if (province) setTimeout(() => setSelectedProvince(province), 50)
      if (city) setTimeout(() => setSelectedCity(city), 100)
      
      toast({ title: "Address Applied", description: "Shipping details updated." })
  }

  const handleSelectSavedAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const addressId = e.target.value
      if (!addressId) return

      if (addressId === 'new') {
          setFormData(prev => ({ ...prev, firstName: "", lastName: "", address: "", barangay: "", postalCode: "", phone: "" }))
          setSelectedRegion("")
          setSelectedProvince("")
          setSelectedCity("")
          return
      }

      const selected = savedAddresses.find(a => a.id === addressId)
      if (selected) {
          fillAddressForm(selected)
      }
  }

  useEffect(() => {
    if (mounted) {
        const draftData = {
            ...formData,
            region: selectedRegion,
            province: selectedProvince,
            city: selectedCity
        }
        localStorage.setItem("checkout_draft", JSON.stringify(draftData))
    }
  }, [formData, selectedRegion, selectedProvince, selectedCity, mounted])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value})
  }
  
  // --- CORRECTED CHECKOUT HANDLER ---
 const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 1. COD LOGIC
    if (paymentMethod === 'cod') {
        const params = new URLSearchParams({
            email: formData.email, // <--- ADD THIS LINE
            firstName: formData.firstName, // <--- AND THIS (Useful for the order record)
            lastName: formData.lastName,   // <--- AND THIS
            address: formData.address,
            city: selectedCity,
            postal: formData.postalCode,
            mobile: formData.phone,
            region: selectedRegion,
            province: selectedProvince
        }).toString()
        
        setTimeout(() => {
            setIsLoading(false)
            router.push(`/checkout/cod-confirm?${params}`)
        }, 500)
        return
    }

    // 2. CARD/WALLET LOGIC (Redirect to Payment)
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`
    sessionStorage.setItem("current_checkout_session", JSON.stringify({
        id: orderId, 
        items, 
        total, 
        shippingCost: shippingCost || 0, 
        subtotal, 
        paymentMethod, 
        customer: { 
            ...formData, 
            region: selectedRegion, 
            province: selectedProvince, 
            city: selectedCity 
        }
    }))
    
    setTimeout(() => { 
        setIsLoading(false)
        router.push(`/checkout/payment`) 
    }, 500)
  }

  // @ts-ignore
  const getProvinces = () => selectedRegion ? ADDRESS_DATA.provinces[selectedRegion] || [] : []
  // @ts-ignore
  const getCities = () => selectedProvince ? ADDRESS_DATA.cities[selectedProvince] || [] : []
  
  const cityList = getCities()
  const shouldShowCityDropdown = selectedProvince && cityList.length > 0

  if (!mounted) return null
  if (items.length === 0) return <div className="min-h-screen flex items-center justify-center">Empty Cart</div>

  return (
    <div className="min-h-screen bg-transparent font-sans text-[#1a1a1a] dark:text-white flex flex-col lg:flex-row pt-20 pb-40">
      
      {/* LEFT COLUMN: FORM */}
      <div className="flex-1 order-2 lg:order-1 px-6 lg:px-12 xl:px-20 lg:border-r border-stone-200 dark:border-stone-800 pt-8">
         <div className="max-w-xl mx-auto lg:mr-0 lg:ml-auto">
            
            <div className="mb-8 hidden lg:block">
                <div className="text-xs text-stone-500 mt-2 flex items-center">
                    <Link href="/cart" className="hover:underline">Cart</Link> <span className="mx-2">/</span>
                    <span className="font-bold text-foreground">Checkout</span> <span className="mx-2">/</span>
                    <span className="text-stone-500">Payment</span>
                </div>
            </div>

            <form onSubmit={handleCheckout} noValidate className="space-y-10 animate-in fade-in">
                
                {/* SHIPPING ADDRESS */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-foreground">Shipping Address</h2>
                    </div>

                    {/* SAVED ADDRESS SELECTOR */}
                    {savedAddresses.length > 0 && (
                        <div className="mb-6 p-4 bg-[#AB462F]/5 border border-[#AB462F]/20 rounded-lg">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#AB462F] mb-2 block flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Use a saved address
                            </label>
                            <select 
                                className="w-full bg-white dark:bg-black/20 border border-stone-300 dark:border-stone-700 rounded-md px-3 py-2 text-sm focus:border-[#AB462F] outline-none cursor-pointer"
                                onChange={handleSelectSavedAddress}
                                defaultValue=""
                            >
                                <option value="" disabled>Select an address...</option>
                                {savedAddresses.map((addr) => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.first_name} {addr.last_name} — {addr.city}, {addr.province}
                                    </option>
                                ))}
                                <option value="new" className="font-bold text-[#AB462F]">+ Enter New Address</option>
                            </select>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                        <input name="firstName" required placeholder="First name" className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-blue-50/30 dark:bg-black/20 dark:text-white" value={formData.firstName} onChange={handleInputChange} />
                        <input name="lastName" required placeholder="Last name" className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-blue-50/30 dark:bg-black/20 dark:text-white" value={formData.lastName} onChange={handleInputChange} />
                    </div>

                    <select required className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedProvince(""); setSelectedCity("") }}>
                        <option value="" disabled>Select Region</option>
                        {ADDRESS_DATA.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                        <select required disabled={!selectedRegion} className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white disabled:bg-stone-100 disabled:text-stone-400" value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setSelectedCity("") }}>
                            <option value="" disabled>Select Province</option>
                            {getProvinces().map((p: string) => <option key={p} value={p}>{p}</option>)}
                        </select>

                        {shouldShowCityDropdown ? (
                            <select required disabled={!selectedProvince} className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white disabled:bg-stone-100 disabled:text-stone-400" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                <option value="" disabled>Select City</option>
                                {cityList.map((c: string) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        ) : (
                            <input placeholder="City / Municipality" disabled={!selectedProvince} className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white disabled:bg-stone-100" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} />
                        )}
                    </div>

                    <input name="barangay" required placeholder="Barangay" className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" value={formData.barangay} onChange={handleInputChange} />
                    <input name="address" required placeholder="Street Address, House No." className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" value={formData.address} onChange={handleInputChange} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <input name="postalCode" required placeholder="Postal Code" className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" value={formData.postalCode} onChange={handleInputChange} />
                        <input name="phone" required placeholder="Mobile Number" className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-blue-50/30 dark:bg-black/20 dark:text-white" value={formData.phone} onChange={handleInputChange} />
                    </div>
                </section>

                {/* PAYMENT SECTION */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground">Payment</h2>
                    <div className="border border-stone-300 dark:border-stone-700 rounded-md overflow-hidden bg-white dark:bg-black/10">
                        <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-stone-300 dark:border-stone-700 ${paymentMethod === 'card' ? 'bg-[#fcf8f2] dark:bg-black/40 border-[#AB462F]/30 dark:border-[#AB462F]' : 'bg-white dark:bg-black/20'}`}>
                            <div className="flex items-center gap-3"><input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#AB462F]" /><span className="text-sm font-medium text-foreground">Credit/Debit Card</span></div>
                        </label>
                        <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-stone-300 dark:border-stone-700 ${paymentMethod === 'wallet' ? 'bg-[#fcf8f2] dark:bg-black/40 border-[#AB462F]/30 dark:border-[#AB462F]' : 'bg-white dark:bg-black/20'}`}>
                            <div className="flex items-center gap-3"><input type="radio" name="payment" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="accent-[#AB462F]" /><span className="text-sm font-medium text-foreground">E-Wallets</span></div>
                        </label>
                        <label className={`flex items-center justify-between p-4 cursor-pointer ${paymentMethod === 'cod' ? 'bg-[#fcf8f2] dark:bg-black/40 border-[#AB462F]/30 dark:border-[#AB462F]' : 'bg-white dark:bg-black/20'}`}>
                            <div className="flex items-center gap-3"><input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-[#AB462F]" /><span className="text-sm font-medium text-foreground">Cash on Delivery (COD)</span></div>
                        </label>
                    </div>
                </section>

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-6">
                    <Link href="/cart" className="text-sm text-[#AB462F] flex items-center gap-2 hover:opacity-80 font-bold"><ArrowLeft className="w-4 h-4" /> Return to cart</Link>
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-12 h-14 bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold text-sm uppercase tracking-widest rounded-full shadow-lg transition-all">
                        {isLoading ? "Processing..." : (paymentMethod === 'cod' ? "Review Order Details" : "Continue to Payment")}
                    </Button>
                </div>
            </form>
         </div>
      </div>
      
      {/* RIGHT COLUMN: SUMMARY */}
      <div className="hidden lg:block flex-1 order-1 lg:order-2 glass border-l border-stone-200 dark:border-white/10 px-6 lg:px-12 xl:px-20 py-12">
          <div className="max-w-md mx-auto sticky top-32">
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                      <div key={`${item.id}-${item.variant}`} className="flex gap-5 items-start">
                          <div className="h-20 w-20 bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden relative flex-shrink-0 shadow-sm">
                              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                          </div>
                          <div className="flex-1 pt-1">
                              <h3 className="font-bold text-base uppercase tracking-tight text-foreground leading-none mb-1">{item.name}</h3>
                              <p className="text-xs text-stone-500 font-medium">{item.variant}</p>
                              <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity}</p> 
                          </div>
                          <div className="text-right pt-1"><p className="font-bold text-base text-foreground">₱{(item.price * item.quantity).toLocaleString()}</p></div>
                      </div>
                  ))}
              </div>
              <div className="mt-10 pt-8 border-t border-stone-300 dark:border-stone-700">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm text-stone-600 dark:text-stone-300"><span>Subtotal</span><span className="font-medium text-foreground">₱{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center text-sm text-stone-600 dark:text-stone-300">
                        <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-stone-400" /> Shipping</span>
                        <span className="font-medium text-[#AB462F]">{shippingCost === null ? "Calculated after address" : (shippingCost === 0 ? "Free" : `₱${shippingCost}`)}</span>
                    </div>
                  </div>
                  <div className="border-t border-stone-300 dark:border-stone-700 mt-6 pt-6 flex justify-between items-baseline">
                      <span className="text-lg font-bold text-foreground">Total</span>
                      <div className="text-right flex items-baseline gap-2"><span className="text-xs text-stone-500 font-semibold tracking-wider">PHP</span><span className="font-black text-3xl text-[#AB462F] tracking-tight">₱{total.toLocaleString()}</span></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}