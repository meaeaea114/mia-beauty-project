"use client"

import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { 
  CreditCard, Wallet, Truck, 
  ChevronRight, Lock, 
  ArrowRight, Loader2, MapPin, ArrowLeft 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/app/context/cart-context" 
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

// --- LOCATION DATA (EXPANDED TO BE COMPREHENSIVE) ---
const PHILIPPINE_ADDRESS_DATA = {
    regions: [
        { name: "National Capital Region (NCR)", code: "NCR" },
        { name: "Cordillera Administrative Region (CAR)", code: "CAR" },
        { name: "Ilocos Region (Region I)", code: "I" },
        { name: "Cagayan Valley (Region II)", code: "II" },
        { name: "Central Luzon (Region III)", code: "III" },
        { name: "CALABARZON (Region IV-A)", code: "IV-A" },
        { name: "MIMAROPA (Region IV-B)", code: "IV-B" },
        { name: "Bicol Region (Region V)", code: "V" },
        { name: "Western Visayas (Region VI)", code: "VI" },
        { name: "Central Visayas (Region VII)", code: "VII" },
        { name: "Eastern Visayas (Region VIII)", code: "VIII" },
        { name: "Zamboanga Peninsula (Region IX)", code: "IX" },
        { name: "Northern Mindanao (Region X)", code: "X" },
        { name: "Davao Region (Region XI)", code: "XI" },
        { name: "SOCCSKSARGEN (Region XII)", code: "XII" },
        { name: "Caraga (Region XIII)", code: "XIII" },
        { name: "BARMM", code: "BARMM" },
    ],
    provinces: {
        "NCR": ["Metro Manila"],
        "CAR": ["Benguet", "Ifugao", "Kalinga", "Mountain Province", "Abra", "Apayao"],
        "I": ["Pangasinan", "La Union", "Ilocos Sur", "Ilocos Norte"],
        "II": ["Cagayan", "Isabela", "Nueva Vizcaya", "Quirino", "Batanes"],
        "III": ["Bulacan", "Pampanga", "Tarlac", "Zambales", "Bataan", "Nueva Ecija", "Aurora"],
        "IV-A": ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"],
        "IV-B": ["Palawan", "Oriental Mindoro", "Occidental Mindoro", "Marinduque", "Romblon"],
        "V": ["Albay", "Camarines Sur", "Camarines Norte", "Sorsogon", "Catanduanes", "Masbate"],
        "VI": ["Iloilo", "Negros Occidental", "Aklan", "Capiz", "Antique", "Guimaras"],
        "VII": ["Cebu", "Bohol", "Negros Oriental", "Siquijor"],
        "VIII": ["Leyte", "Samar", "Southern Leyte", "Biliran", "Eastern Samar", "Northern Samar"],
        "IX": ["Zamboanga del Sur", "Zamboanga del Norte", "Zamboanga Sibugay"],
        "X": ["Misamis Oriental", "Bukidnon", "Misamis Occidental", "Lanao del Norte", "Camiguin"],
        "XI": ["Davao del Sur", "Davao del Norte", "Davao Oriental", "Davao Occidental", "Davao de Oro"],
        "XII": ["South Cotabato", "Sultan Kudarat", "North Cotabato", "Sarangani"],
        "XIII": ["Agusan del Norte", "Surigao del Norte", "Agusan del Sur", "Surigao del Sur", "Dinagat Islands"],
        "BARMM": ["Maguindanao", "Lanao del Sur", "Basilan", "Sulu", "Tawi-Tawi", "Cotabato City (Independent)"]
    },
    cities: {
        "Metro Manila": ["Manila", "Quezon City", "Makati", "Taguig", "Pasig", "Pasay", "Caloocan", "Mandaluyong", "San Juan", "Paranaque", "Las Pinas", "Muntinlupa", "Malabon", "Navotas", "Valenzuela", "Marikina"],
        "Batangas": ["Batangas City", "Lipa City", "Tanauan City", "Sto. Tomas", "Calaca", "Nasugbu"],
        "Cavite": ["Bacoor", "Dasmarinas", "Imus", "Tagaytay", "General Trias", "Trece Martires", "Kawit"],
        "Laguna": ["Calamba", "Santa Rosa", "San Pablo", "Binan", "Cabuyao", "San Pedro", "Los Baños"],
        "Quezon": ["Lucena City", "Tayabas City", "Gumaca"],
        "Rizal": ["Antipolo City", "Cainta", "Taytay", "Angono"],
        "Pampanga": ["San Fernando City", "Angeles City", "Mabalacat City", "Guagua"],
        "Bulacan": ["Malolos City", "San Jose del Monte City", "Meycauayan City", "Sta. Maria"],
        "Tarlac": ["Tarlac City", "Capas"],
        "Zambales": ["Olongapo City", "Subic"],
        "Cebu": ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay City", "Toledo City", "Danao City"],
        "Iloilo": ["Iloilo City", "Passi City", "Pototan"],
        "Negros Occidental": ["Bacolod City", "Talisay City", "Silay City", "Bago City"],
        "Davao del Sur": ["Davao City", "Digos City"],
        "Misamis Oriental": ["Cagayan de Oro City", "Gingoog City"],
        "South Cotabato": ["General Santos City", "Koronadal City"],
        "Benguet": ["Baguio City", "La Trinidad"],
        "Albay": ["Legazpi City", "Tabaco City"],
        "Palawan": ["Puerto Princesa City"],
        "Zamboanga del Sur": ["Zamboanga City (Independent)"],
        "Leyte": ["Tacloban City", "Ormoc City"],
        "North Cotabato": ["Kidapawan City"]
    }
} as const

export default function CheckoutPage() {
  const cartData = useCart() || {} 
  const items = cartData.items || [] 
  const subtotal = cartData.subtotal ?? 0  

  const { toast } = useToast()
  const router = useRouter()

  
  const [isLoading, setIsLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
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
  const total = subtotal + (shippingCost ?? 0) 

  // --- RESTORED: AUTO-FILL LOGIC ---
  const fillAddressForm = useCallback((data: any, profileDefaults?: any) => {
      const firstName = data.first_name || data.firstName || profileDefaults?.firstName || ""
      const lastName = data.last_name || data.lastName || profileDefaults?.lastName || ""
      const phone = data.phone || ""
      const address = data.address || ""
      const barangay = data.barangay || ""
      const postalCode = data.postal_code || data.postalCode || ""
      const region = data.region || ""
      const province = data.province || ""
      const city = data.city || ""

      setFormData(prev => ({
          ...prev, 
          firstName, lastName, phone, address, barangay, postalCode,
          email: profileDefaults?.email || prev.email
      }))

      if (region) setSelectedRegion(region)
      if (province) setSelectedProvince(province)
      if (city) setSelectedCity(city)
      
      toast({ title: "Address Applied", description: "Shipping details updated." })
  }, [toast])

  const initCheckout = useCallback(async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
            const currentUser = session.user
            const userName = currentUser.user_metadata.first_name || ""
            setUser({ 
                name: userName, 
                email: currentUser.email!,
                id: currentUser.id
            })
            
            const initialFormData = {
                email: currentUser.email || "",
                firstName: userName,
                lastName: currentUser.user_metadata.last_name || "",
                address: "", barangay: "", postalCode: "", phone: "" 
            }

            const { data: addresses } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('is_default', { ascending: false })
                // .limit(1)  <-- REMOVED THIS TO FETCH ALL ADDRESSES

            if (addresses && addresses.length > 0) {
                setSavedAddresses(addresses)
                fillAddressForm(addresses[0], initialFormData)
            } else {
                const { data: lastOrder } = await supabase
                    .from('orders')
                    .select('customer_details')
                    .eq('customer_email', currentUser.email)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()
                
                if (lastOrder?.customer_details) {
                     fillAddressForm(lastOrder.customer_details, initialFormData)
                } else {
                    setFormData(initialFormData)
                }
            }
        } else {
            // Guest Logic: Load draft
            const draft = localStorage.getItem("checkout_draft")
            if (draft) {
                const parsed = JSON.parse(draft)
                setFormData(parsed)
                if(parsed.region) setSelectedRegion(parsed.region)
                if(parsed.region && parsed.province) setSelectedProvince(parsed.province)
                if(parsed.region && parsed.province && parsed.city) setSelectedCity(parsed.city)
            }
        }
    } catch (error) {
        console.error("Error fetching user data:", error)
    } finally {
        setFetchingData(false)
    }
  }, [fillAddressForm])

  useEffect(() => {
    setMounted(true)
    initCheckout() 
  }, [initCheckout])

  // --- ADDRESS & INPUT HANDLERS ---
  const handleSelectSavedAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const addressId = e.target.value
      if (!addressId) return

      if (addressId === 'new') {
          setFormData(prev => ({ ...prev, firstName: user?.name.split(' ')[0] || "", lastName: user?.name.split(' ').slice(1).join(' ') || "", address: "", barangay: "", postalCode: "", phone: "" }))
          setSelectedRegion("")
          setSelectedProvince("")
          setSelectedCity("")
          return
      }

      const selected = savedAddresses.find(a => a.id === addressId)
      if (selected) {
          fillAddressForm(selected, { email: user?.email })
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '') // Remove non-digits
      if (value.length <= 11) {
          setFormData({ ...formData, phone: value })
      }
  }

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '') // Remove non-digits
      if (value.length <= 4) {
          setFormData({ ...formData, postalCode: value })
      }
  }
  
  // --- CHECKOUT HANDLER ---
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.phone.length < 11) {
        toast({ title: "Invalid Phone", description: "Please enter a valid 11-digit mobile number.", variant: "destructive" })
        return
    }

    setIsLoading(true)

    // 1. COD LOGIC (Review/Confirm Address)
    if (paymentMethod === 'cod') {
        const params = new URLSearchParams({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: selectedCity,
            postal: formData.postalCode,
            mobile: formData.phone,
            region: selectedRegion,
            province: selectedProvince,
            barangay: formData.barangay, // Ensure barangay is passed for confirmation page
        }).toString()
        
        setTimeout(() => {
            setIsLoading(false)
            router.push(`/checkout/cod-confirm?${params}`)
        }, 500)
        return
    }

    // 2. CARD/WALLET LOGIC (Continue to Payment Portal)
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`
    sessionStorage.setItem("current_checkout_session", JSON.stringify({
        id: orderId, 
        items, 
        total, 
        shippingCost: shippingCost ?? 0, 
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

  // --- HELPERS ---
  // @ts-ignore
  const getProvinces = () => selectedRegion ? PHILIPPINE_ADDRESS_DATA.provinces[selectedRegion] || [] : []
  // @ts-ignore
  const getCities = () => selectedProvince ? PHILIPPINE_ADDRESS_DATA.cities[selectedProvince] || [] : []
  
  const cityList = getCities()
  const shouldShowCityDropdown = selectedProvince && cityList.length > 0

  // --- UI COMPONENT: PAYMENT CARD ---
  const PaymentCard = ({ id, label, icon: Icon, description }: any) => (
      <div 
        onClick={() => setPaymentMethod(id)}
        className={`
            relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-start gap-4 group
            ${paymentMethod === id 
                ? 'border-[#AB462F] bg-[#AB462F]/5 shadow-sm' 
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-black/20 hover:border-stone-300 dark:hover:border-stone-500'}
        `}
      >
          <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
              ${paymentMethod === id ? 'border-[#AB462F]' : 'border-stone-300 dark:border-stone-500 group-hover:border-stone-400'}
          `}>
              {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-[#AB462F]" />}
          </div>
          
          <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${paymentMethod === id ? 'text-[#AB462F]' : 'text-stone-400'}`} />
                  <span className={`font-bold text-sm ${paymentMethod === id ? 'text-[#AB462F]' : 'text-stone-700 dark:text-stone-200'}`}>{label}</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{description}</p>
          </div>
      </div>
  )

  if (!mounted || fetchingData) return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
          <Loader2 className="w-8 h-8 text-[#AB462F] animate-spin" />
      </div>
  )

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent space-y-4">
        <p className="text-stone-500 font-medium">Your cart is currently empty.</p>
        <Link href="/shop" className="text-[#AB462F] font-bold uppercase text-xs tracking-widest border-b border-[#AB462F]">Start Shopping</Link>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-transparent font-sans pt-28 pb-20 px-4 md:px-8 text-[#1a1a1a] dark:text-white">
        
        {/* HEADER */}
        <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
                    Check<span className="font-serif italic font-normal text-[#AB462F] lowercase">out</span>
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-stone-400 uppercase">
                    <Link href="/cart" className="text-[#AB462F] hover:underline">Cart</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-stone-800 dark:text-white">Information</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Payment</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-white/70 dark:bg-black/50 px-4 py-2 rounded-full shadow-sm border border-stone-100 dark:border-white/10">
                <Lock className="w-3 h-3 text-green-600" />
                <span>Secure SSL Encrypted Transaction</span>
            </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: FORMS */}
            <div className="lg:col-span-7 space-y-12">
                
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-10">
                    
                    {/* SAVED ADDRESS ALERT */}
                    {savedAddresses.length > 0 && (
                        <div className="p-4 bg-white dark:bg-black/40 border border-[#AB462F]/20 rounded-xl shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#AB462F]/10 flex items-center justify-center text-[#AB462F]"><MapPin className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-stone-700 dark:text-stone-200">Use Saved Address</p>
                                    <p className="text-[10px] text-stone-500">Quickly fill your details.</p>
                                </div>
                            </div>
                            <select 
                                className="bg-transparent text-xs font-bold text-[#AB462F] outline-none cursor-pointer text-right"
                                onChange={handleSelectSavedAddress}
                                defaultValue=""
                            >
                                <option value="" disabled>Select...</option>
                                {savedAddresses.map((addr: any) => (
                                    <option key={addr.id} value={addr.id}>{addr.first_name} ({addr.city})</option>
                                ))}
                                <option value="new">+ New Address</option>
                            </select>
                        </div>
                    )}

                    {/* SECTION 1: CONTACT & SHIPPING DETAILS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4 border-b border-stone-200 dark:border-stone-700 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">Contact & Shipping Details</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">First Name</label>
                                <input required name="firstName" type="text" placeholder="Jane" 
                                    className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-stone-400"
                                    value={formData.firstName} onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Last Name</label>
                                <input required name="lastName" type="text" placeholder="Doe" 
                                    className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-stone-400"
                                    value={formData.lastName} onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Email Address</label>
                            <input required name="email" type="email" placeholder="jane@example.com" 
                                className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-stone-400"
                                value={formData.email} onChange={handleInputChange}
                            />
                        </div>

                        {/* REGION / PROVINCE / CITY */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Region</label>
                            <select required className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none transition-all cursor-pointer appearance-none"
                                value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedProvince(""); setSelectedCity("") }}
                            >
                                <option value="" disabled>Select Region</option>
                                {PHILIPPINE_ADDRESS_DATA.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Province</label>
                                <select required disabled={!selectedRegion} className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none disabled:bg-stone-50 disabled:text-stone-400"
                                    value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setSelectedCity("") }}
                                >
                                    <option value="" disabled>Select Province</option>
                                    {getProvinces().map((p: string) => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">City</label>
                                {shouldShowCityDropdown ? (
                                    <select required disabled={!selectedProvince} className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none disabled:bg-stone-50 disabled:text-stone-400"
                                        value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                                    >
                                        <option value="" disabled>Select City</option>
                                        {cityList.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                ) : (
                                    <input required placeholder="City" disabled={!selectedProvince} className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none disabled:bg-stone-50" 
                                        value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} 
                                    />
                                )}
                            </div>
                        </div>

                        {/* ADDRESS LINES */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Barangay</label>
                            <input required name="barangay" type="text" className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none" 
                                value={formData.barangay} onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Street Address</label>
                            <input required name="address" type="text" placeholder="Street Address, House No." 
                                className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-stone-400"
                                value={formData.address} onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Postal Code</label>
                                <input required name="postalCode" type="text" placeholder="xxxx" 
                                    className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-mono placeholder:text-stone-400"
                                    value={formData.postalCode} onChange={handlePostalChange} maxLength={4}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 pl-1">Mobile Number</label>
                                <input required name="phone" type="tel" placeholder="09xxxxxxxxx" 
                                    className="w-full bg-white dark:bg-black/20 border border-stone-200 dark:border-stone-700 text-[#1a1a1a] dark:text-white focus:border-[#AB462F] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-mono placeholder:text-stone-400"
                                    value={formData.phone} onChange={handlePhoneChange} maxLength={11}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-stone-200 dark:bg-stone-700" />

                    {/* SECTION 2: PAYMENT */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4 border-b border-stone-200 dark:border-stone-700 pb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">Payment Method</h2>
                        </div>

                        <div className="space-y-3">
                            <PaymentCard 
                                id="card" label="Credit / Debit Card" icon={CreditCard}
                                description="Securely pay with Visa, Mastercard, or AMEX. Powered by PayMongo."
                            />
                            <PaymentCard 
                                id="wallet" label="E-Wallet" icon={Wallet}
                                description="Pay via GCash, Maya, ShopeePay, or PayPal."
                            />
                            <PaymentCard 
                                id="cod" label="Cash on Delivery" icon={Truck}
                                description="Pay in cash upon delivery. Please prepare exact amount."
                            />
                        </div>
                    </div>

                    {/* Return Link (Kept for navigation) */}
                    <div className="flex justify-start">
                        <Link href="/cart" className="text-sm text-[#AB462F] flex items-center gap-2 hover:opacity-80 font-bold">
                            <ArrowLeft className="w-4 h-4" /> Return to cart
                        </Link>
                    </div>

                </form>
            </div>

            {/* --- RIGHT COLUMN: ORDER SUMMARY (STICKY) --- */}
            <div className="lg:col-span-5">
                <div className="sticky top-32">
                    <div className="bg-white dark:bg-black/40 p-8 rounded-[32px] shadow-2xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-100 dark:border-white/10 relative overflow-hidden">
                        
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#AB462F]/10 to-transparent rounded-bl-full pointer-events-none" />

                        <h3 className="font-serif font-bold text-2xl mb-6">Order Summary</h3>

                        {/* Items List */}
                        <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item: any) => (
                                <div key={`${item.id}-${item.variant}`} className="flex gap-4 items-center group">
                                    <div className="w-16 h-16 bg-stone-50 dark:bg-black/50 rounded-xl border border-stone-100 dark:border-white/10 overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm uppercase tracking-wide text-[#1a1a1a] dark:text-white">{item.name}</h4>
                                        <p className="text-[10px] text-stone-500 uppercase tracking-widest">{item.variant || 'Standard'}</p>
                                        <p className="text-xs text-stone-400 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm text-[#1a1a1a] dark:text-white">₱{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Calculations */}
                        <div className="space-y-3 pt-6 border-t border-dashed border-stone-200 dark:border-stone-700">
                            <div className="flex justify-between text-sm text-stone-500">
                                <span>Subtotal</span>
                                <span>₱{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-500">
                                <span>Shipping</span>
                                <span className="font-medium text-[#AB462F]">
                                    {shippingCost === null ? "Calculated after address" : (shippingCost === 0 ? "Free" : `₱${shippingCost.toLocaleString()}`)}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline pt-4 border-t border-stone-100 dark:border-stone-700">
                                <span className="font-bold text-lg text-[#1a1a1a] dark:text-white">Total</span>
                                <span className="font-serif italic text-3xl text-[#AB462F]">₱{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON (The ONLY functional button now) */}
                        <Button 
                            type="submit" 
                            form="checkout-form" // Links this button to the form on the left
                            disabled={isLoading}
                            className="w-full h-14 mt-8 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.2em] uppercase text-xs shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            {isLoading ? "Processing..." : (
                                <span className="flex items-center gap-2">
                                    {/* DYNAMIC TEXT LOGIC */}
                                    {paymentMethod === 'cod' ? 'CONFIRM ADDRESS' : 'CONTINUE TO PAYMENT'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>

                        <div className="mt-6 text-center">
                            <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#AB462F] border-b border-transparent hover:border-[#AB462F] transition-all">
                                Forgot something? Keep Shopping
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}