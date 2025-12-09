"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { useCart } from "@/app/context/cart-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, ChevronUp, ShoppingBag, Truck } from "lucide-react" 
import Link from "next/link"

// --- EXPANDED DATASET FOR PHILIPPINE CITIES ---
const ADDRESS_DATA = {
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
        { name: "Bangsamoro (BARMM)", code: "BARMM" }
    ],
    provinces: {
        "NCR": ["Metro Manila"],
        "CAR": ["Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province"],
        "I": ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
        "II": ["Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino"],
        "III": ["Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales"],
        "IV-A": ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"],
        "IV-B": ["Marinduque", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Romblon"],
        "V": ["Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Sorsogon"],
        "VI": ["Aklan", "Antique", "Capiz", "Guimaras", "Iloilo", "Negros Occidental"],
        "VII": ["Bohol", "Cebu", "Negros Oriental", "Siquijor"],
        "VIII": ["Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Samar", "Southern Leyte"],
        "IX": ["Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"],
        "X": ["Bukidnon", "Camiguin", "Lanao del Norte", "Misamis Occidental", "Misamis Oriental"],
        "XI": ["Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental"],
        "XII": ["Cotabato", "Sarangani", "South Cotabato", "Sultan Kudarat"],
        "XIII": ["Agusan del Norte", "Agusan del Sur", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur"],
        "BARMM": ["Basilan", "Lanao del Sur", "Maguindanao", "Sulu", "Tawi-Tawi"]
    },
    cities: {
        // --- NCR ---
        "Metro Manila": ["Manila", "Quezon City", "Makati", "Taguig", "Pasig", "Mandaluyong", "Marikina", "Pasay", "Caloocan", "Las Piñas", "Muntinlupa", "Parañaque", "San Juan", "Valenzuela", "Malabon", "Navotas", "Pateros"],
        
        // --- CAR ---
        "Benguet": ["Baguio City", "La Trinidad", "Itogon", "Tuba", "Mankayan"],
        "Abra": ["Bangued", "Bucay", "Tayum"],
        "Apayao": ["Kabugao", "Luna"],
        "Ifugao": ["Lagawe", "Banaue", "Kiangan"],
        "Kalinga": ["Tabuk City", "Lubuagan"],
        "Mountain Province": ["Bontoc", "Sagada", "Bauko"],

        // --- REGION I ---
        "Ilocos Norte": ["Laoag City", "Batac City", "San Nicolas", "Pagudpud"],
        "Ilocos Sur": ["Vigan City", "Candon City", "Narvacan"],
        "La Union": ["San Fernando City", "Bauang", "Agoo", "San Juan"],
        "Pangasinan": ["Dagupan City", "Alaminos City", "San Carlos City", "Urdaneta City", "Lingayen", "Rosales"],

        // --- REGION II ---
        "Batanes": ["Basco", "Itbayat", "Sabtang"],
        "Cagayan": ["Tuguegarao City", "Aparri", "Lal-lo"],
        "Isabela": ["Ilagan City", "Cauayan City", "Santiago City", "Roxas"],
        "Nueva Vizcaya": ["Bayombong", "Solano"],
        "Quirino": ["Cabarroguis", "Diffun"],

        // --- REGION III ---
        "Aurora": ["Baler", "Maria Aurora", "Dipaculao"],
        "Bataan": ["Balanga City", "Mariveles", "Dinalupihan", "Orani"],
        "Bulacan": ["Malolos City", "Meycauayan City", "San Jose del Monte", "Marilao", "Baliwag", "Bocaue", "Plaridel", "Sta. Maria"],
        "Nueva Ecija": ["Cabanatuan City", "Gapan City", "San Jose City", "Palayan City", "Muñoz City"],
        "Pampanga": ["San Fernando City", "Angeles City", "Mabalacat City", "Guagua", "Lubao", "Mexico", "Porac"],
        "Tarlac": ["Tarlac City", "Capas", "Concepcion", "Paniqui", "Camiling"],
        "Zambales": ["Olongapo City", "Subic", "Iba", "Masinloc", "Castillejos"],

        // --- REGION IV-A ---
        "Batangas": ["Batangas City", "Lipa City", "Tanauan City", "Sto. Tomas", "Nasugbu", "Lemery", "Rosario", "Bauan", "San Juan"],
        "Cavite": ["Bacoor City", "Dasmarinas City", "Imus City", "Cavite City", "Tagaytay City", "General Trias", "Silang", "Trece Martires"],
        "Laguna": ["Santa Rosa City", "Calamba City", "San Pedro City", "Binan City", "Cabuyao City", "San Pablo City", "Los Banos", "Sta. Cruz"],
        "Quezon": ["Lucena City", "Tayabas City", "Candelaria", "Sariaya", "Pagbilao", "Tiaong"],
        "Rizal": ["Antipolo City", "Cainta", "Taytay", "Binangonan", "San Mateo", "Angono", "Rodriguez", "Tanay"],

        // --- REGION IV-B ---
        "Marinduque": ["Boac", "Mogpog", "Gasan"],
        "Occidental Mindoro": ["Mamburao", "San Jose", "Sablayan"],
        "Oriental Mindoro": ["Calapan City", "Puerto Galera", "Pinamalayan"],
        "Palawan": ["Puerto Princesa City", "Coron", "El Nido", "Brooke's Point"],
        "Romblon": ["Romblon", "Odiongan"],

        // --- REGION V ---
        "Albay": ["Legazpi City", "Ligao City", "Tabaco City", "Daraga", "Camalig"],
        "Camarines Norte": ["Daet", "Labo", "Jose Panganiban"],
        "Camarines Sur": ["Naga City", "Iriga City", "Pili"],
        "Catanduanes": ["Virac", "San Andres"],
        "Masbate": ["Masbate City", "Aroroy"],
        "Sorsogon": ["Sorsogon City", "Bulan", "Gubat"],

        // --- REGION VI ---
        "Aklan": ["Kalibo", "Malay (Boracay)"],
        "Antique": ["San Jose de Buenavista"],
        "Capiz": ["Roxas City"],
        "Guimaras": ["Jordan", "Buenavista"],
        "Iloilo": ["Iloilo City", "Oton", "Pavia", "Santa Barbara", "Passi City"],
        "Negros Occidental": ["Bacolod City", "Talisay City", "Silay City", "Bago City", "Kabankalan City"],

        // --- REGION VII ---
        "Bohol": ["Tagbilaran City", "Panglao", "Dauis", "Tubigon", "Ubay"],
        "Cebu": ["Cebu City", "Mandaue City", "Lapu-Lapu City", "Talisay City", "Danao City", "Toledo City", "Bogo City", "Carcar City"],
        "Negros Oriental": ["Dumaguete City", "Bayawan City", "Tanjay City", "Bais City"],
        "Siquijor": ["Siquijor", "Larena"],

        // --- REGION VIII ---
        "Biliran": ["Naval"],
        "Eastern Samar": ["Borongan City", "Guiuan"],
        "Leyte": ["Tacloban City", "Ormoc City", "Palo", "Tanauan"],
        "Northern Samar": ["Catarman", "Laoang"],
        "Samar": ["Catbalogan City", "Calbayog City"],
        "Southern Leyte": ["Maasin City", "Sogod"],

        // --- REGION IX ---
        "Zamboanga del Norte": ["Dipolog City", "Dapitan City"],
        "Zamboanga del Sur": ["Pagadian City"],
        "Zamboanga Sibugay": ["Ipil"],

        // --- REGION X ---
        "Bukidnon": ["Malaybalay City", "Valencia City", "Manolo Fortich"],
        "Camiguin": ["Mambajao"],
        "Lanao del Norte": ["Iligan City", "Tubod"],
        "Misamis Occidental": ["Oroquieta City", "Ozamiz City", "Tangub City"],
        "Misamis Oriental": ["Cagayan de Oro City", "Gingoog City", "El Salvador City"],

        // --- REGION XI ---
        "Davao de Oro": ["Nabunturan", "Monkayo"],
        "Davao del Norte": ["Tagum City", "Panabo City", "Samal City"],
        "Davao del Sur": ["Davao City", "Digos City", "Santa Cruz", "Bansalan"],
        "Davao Occidental": ["Malita"],
        "Davao Oriental": ["Mati City"],

        // --- REGION XII ---
        "Cotabato": ["Kidapawan City", "Midsayap", "Pikit", "Kabacan"],
        "Sarangani": ["Alabel", "Glan", "Kiamba", "Maasim", "Maitum"],
        "South Cotabato": ["General Santos City (GenSan)", "Koronadal City", "Polomolok", "Tupi"],
        "Sultan Kudarat": ["Tacurong City", "Isulan"],

        // --- REGION XIII ---
        "Agusan del Norte": ["Butuan City", "Cabadbaran City"],
        "Agusan del Sur": ["Bayugan City", "San Francisco"],
        "Dinagat Islands": ["San Jose"],
        "Surigao del Norte": ["Surigao City", "Siargao (General Luna)"],
        "Surigao del Sur": ["Tandag City", "Bislig City"],

        // --- BARMM ---
        "Basilan": ["Isabela City", "Lamitan City"],
        "Lanao del Sur": ["Marawi City"],
        "Maguindanao": ["Cotabato City", "Datu Odin Sinsuat"],
        "Sulu": ["Jolo"],
        "Tawi-Tawi": ["Bongao"]
    }
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card") 
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  
  const [showOrderSummary, setShowOrderSummary] = useState(false)

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
        // NCR: Free over 1500, otherwise 100
        if (selectedRegion === 'NCR') {
            return subtotal > 1500 ? 0 : 100
        }
        // Luzon Provinces: 150
        if (['I', 'II', 'III', 'IV-A', 'IV-B', 'V', 'CAR'].includes(selectedRegion)) {
            return 150
        }
        // Visayas & Mindanao: 200
        return 200
      }
  }, [selectedRegion, subtotal])

  const shippingCost = getShippingCost()
  const total = subtotal + (shippingCost || 0)

  useEffect(() => {
    setMounted(true)
    const storedProfile = localStorage.getItem("mia-beauty-profile")
    if (storedProfile) {
        try {
            const parsedUser = JSON.parse(storedProfile)
            setUser(parsedUser)
            setFormData(prev => ({...prev, email: parsedUser.email}))
        } catch (e) { console.error(e) }
    }

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
  }, [])

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

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    
    // --- MANUAL VALIDATION ---
    const requiredFields = [
        { key: formData.email, label: "Email" },
        { key: formData.firstName, label: "First Name" },
        { key: formData.lastName, label: "Last Name" },
        { key: selectedRegion, label: "Region" },
        { key: selectedProvince, label: "Province" },
        { key: formData.barangay, label: "Barangay" },
        { key: formData.address, label: "Address" },
        { key: formData.postalCode, label: "Postal Code" },
        { key: formData.phone, label: "Phone" }
    ]

    for (const field of requiredFields) {
        if (!field.key || field.key.trim() === "") {
            toast({ 
                title: "Missing Information", 
                description: `Please enter your ${field.label}.`, 
                variant: "destructive" 
            })
            return
        }
    }

    if (!selectedCity) {
        toast({ title: "Missing Information", description: "Please select or enter your City/Municipality.", variant: "destructive" })
        return
    }

    // --- PROCEED ---
    setIsLoading(true)
    
    // --- COD SPECIFIC LOGIC START ---
    if (paymentMethod === 'cod') {
        const params = new URLSearchParams({
            address: formData.address,
            city: selectedCity,
            postal: formData.postalCode,
            mobile: formData.phone,
            region: selectedRegion,
            province: selectedProvince
        }).toString()
        
        // Slight delay for UX then redirect
        setTimeout(() => {
            setIsLoading(false)
            router.push(`/checkout/cod-confirm?${params}`)
        }, 300)
        return
    }
    // --- COD SPECIFIC LOGIC END ---

    // Standard Payment Logic (Card/E-Wallet)
    const orderId = `ORD-2025-${Math.floor(Math.random() * 90000) + 10000}`
    
    try {
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
            localStorage.removeItem("checkout_draft")
            router.push(`/checkout/payment`) 
        }, 50)

    } catch (error) {
        console.error("Session Error:", error)
        setIsLoading(false)
        toast({ title: "System Error", description: "Could not save checkout session. Please try again.", variant: "destructive" })
    }
  }

  // Helpers
  const getProvinces = () => {
      return selectedRegion ? ADDRESS_DATA.provinces[selectedRegion as keyof typeof ADDRESS_DATA.provinces] || [] : []
  }

  const getCities = () => {
      return selectedProvince ? ADDRESS_DATA.cities[selectedProvince as keyof typeof ADDRESS_DATA.cities] || [] : []
  }
  
  // Logic: Show Dropdown if cities exist, otherwise show Text Input
  const cityList = getCities()
  const shouldShowCityDropdown = selectedProvince && cityList.length > 0

  if (!mounted) return null
  if (items.length === 0) return <div className="min-h-screen flex items-center justify-center">Empty Cart</div>

  return (
    // MODIFIED: Changed solid white background to transparent
    <div className="min-h-screen bg-transparent font-sans text-[#1a1a1a] dark:text-white flex flex-col lg:flex-row pt-20 pb-40">
      
      {/* MOBILE ORDER SUMMARY TOGGLE */}
      {/* MODIFIED: Replaced custom background with 'glass' utility for glassmorphism */}
      <div className="lg:hidden glass border-y border-stone-200 dark:border-white/10 px-6 py-4 sticky top-16 z-20">
        <button 
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="w-full flex justify-between items-center text-sm font-bold text-[#AB462F]"
        >
            <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> {showOrderSummary ? "Hide" : "Show"} Order Summary
                {showOrderSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
            <span className="text-stone-900 dark:text-white">₱{total.toLocaleString()}</span>
        </button>
        
        {showOrderSummary && (
            <div className="mt-6 border-t border-stone-200 pt-6 animate-in fade-in slide-in-from-top-2">
                 <div className="space-y-4">
                  {items.map((item) => (
                      <div key={`${item.id}-${item.variant}`} className="flex gap-4 items-center">
                          <div className="h-14 w-14 bg-white border rounded-md overflow-hidden relative">
                              <img src={item.image} alt={item.name} className="h-full object-contain p-1" />
                          </div>
                          <div className="flex-1">
                              <h3 className="font-bold text-xs uppercase tracking-tight text-foreground">{item.name}</h3>
                              <p className="text-[10px] text-stone-500">{item.variant}</p>
                              <p className="text-[10px] text-stone-500 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-xs text-foreground">₱{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                  ))}
                 </div>
                 <div className="space-y-2 mt-4 pt-4 border-t text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground">₱{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium text-[#AB462F]">
                            {shippingCost === null ? "--" : (shippingCost === 0 ? "Free" : `₱${shippingCost}`)}
                        </span>
                    </div>
                 </div>
            </div>
        )}
      </div>

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
                
                {/* 1. CONTACT INFO */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        {/* MODIFIED: Header text color */}
                        <h2 className="text-lg font-bold text-foreground">Contact</h2>
                        {!user && <Link href="/account/login" className="text-xs text-[#AB462F] underline">Log in</Link>}
                    </div>
                    {user ? (
                        <div className="p-3 bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-stone-800 rounded-md text-sm text-foreground">
                            Logged in as <span className="font-bold text-foreground">{user.email}</span>
                        </div>
                    ) : (
                        <input name="email" type="email" required placeholder="Email address" 
                            // MODIFIED: Added dark mode styles for input
                            className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm focus:border-[#AB462F] outline-none dark:bg-black/20 dark:text-white" 
                            value={formData.email} onChange={handleInputChange} />
                    )}
                </section>

                {/* 2. SHIPPING ADDRESS */}
                <section className="space-y-4">
                    {/* MODIFIED: Header text color */}
                    <h2 className="text-lg font-bold text-foreground">Shipping Address</h2>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <input name="firstName" required placeholder="First name" 
                            // MODIFIED: Added dark mode styles for input
                            className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-blue-50/30 dark:bg-black/20 dark:text-white" 
                            value={formData.firstName} onChange={handleInputChange} />
                        <input name="lastName" required placeholder="Last name" 
                            // MODIFIED: Added dark mode styles for input
                            className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-blue-50/30 dark:bg-black/20 dark:text-white" 
                            value={formData.lastName} onChange={handleInputChange} />
                    </div>

                    {/* REGION */}
                    <select required 
                        // MODIFIED: Added dark mode styles for select
                        className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" 
                        value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedProvince(""); setSelectedCity("") }}>
                        <option value="" disabled>Select Region</option>
                        {ADDRESS_DATA.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>

                    {/* PROVINCE */}
                    <div className="grid grid-cols-2 gap-3">
                        <select required disabled={!selectedRegion} 
                            // MODIFIED: Added dark mode styles for select
                            className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white disabled:bg-stone-100 disabled:text-stone-400 dark:disabled:bg-stone-800 dark:disabled:text-stone-600" 
                            value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setSelectedCity("") }}>
                            <option value="" disabled>Select Province</option>
                            {getProvinces().map((p: string) => <option key={p} value={p}>{p}</option>)}
                        </select>

                        {/* CITY (Drop Down or Fallback Input) */}
                        {shouldShowCityDropdown ? (
                            <select 
                                required 
                                disabled={!selectedProvince}
                                // MODIFIED: Added dark mode styles for select
                                className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white disabled:bg-stone-100 disabled:text-stone-400 dark:disabled:bg-stone-800 dark:disabled:text-stone-600"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="" disabled>Select City</option>
                                {cityList.map((c: string) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        ) : (
                            <input 
                                placeholder="City / Municipality" 
                                disabled={!selectedProvince} 
                                // MODIFIED: Added dark mode styles for input
                                className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white disabled:bg-stone-100 disabled:text-stone-400 dark:disabled:bg-stone-800 dark:disabled:text-stone-600" 
                                value={selectedCity} 
                                onChange={(e) => setSelectedCity(e.target.value)} 
                            />
                        )}
                    </div>

                    <input name="barangay" required placeholder="Barangay" 
                        // MODIFIED: Added dark mode styles for input
                        className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" 
                        value={formData.barangay} onChange={handleInputChange} />
                    <input name="address" required placeholder="Street Address, House No." 
                        // MODIFIED: Added dark mode styles for input
                        className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" 
                        value={formData.address} onChange={handleInputChange} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <input name="postalCode" required placeholder="Postal Code" 
                            // MODIFIED: Added dark mode styles for input
                            className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-white dark:bg-black/20 dark:text-white" 
                            value={formData.postalCode} onChange={handleInputChange} />
                        <input name="phone" required placeholder="Mobile Number" 
                            // MODIFIED: Added dark mode styles for input
                            className="w-full border border-stone-300 dark:border-stone-700 rounded-md px-4 py-3 text-sm bg-blue-50/30 dark:bg-black/20 dark:text-white" 
                            value={formData.phone} onChange={handleInputChange} />
                    </div>
                </section>

                {/* Payment Selection */}
                <section className="space-y-4">
                    {/* MODIFIED: Header text color */}
                    <h2 className="text-lg font-bold text-foreground">Payment</h2>
                    <div 
                        // MODIFIED: Added dark mode styles for container
                        className="border border-stone-300 dark:border-stone-700 rounded-md overflow-hidden bg-white dark:bg-black/10"
                    >
                        <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-stone-300 dark:border-stone-700 ${paymentMethod === 'card' ? 'bg-[#fcf8f2] dark:bg-black/40 border-[#AB462F]/30 dark:border-[#AB462F]' : 'bg-white dark:bg-black/20'}`}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#AB462F]" />
                                <span className="text-sm font-medium text-foreground">Credit/Debit Card</span>
                            </div>
                            <div className="flex gap-1"><span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">VISA</span><span className="text-[10px] bg-red-100 text-red-800 px-1 rounded">MC</span></div>
                        </label>
                        
                        <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-stone-300 dark:border-stone-700 ${paymentMethod === 'wallet' ? 'bg-[#fcf8f2] dark:bg-black/40 border-[#AB462F]/30 dark:border-[#AB462F]' : 'bg-white dark:bg-black/20'}`}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="payment" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="accent-[#AB462F]" />
                                <span className="text-sm font-medium text-foreground">E-Wallets</span>
                            </div>
                        </label>

                        <label className={`flex items-center justify-between p-4 cursor-pointer ${paymentMethod === 'cod' ? 'bg-[#fcf8f2] dark:bg-black/40 border-[#AB462F]/30 dark:border-[#AB462F]' : 'bg-white dark:bg-black/20'}`}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-[#AB462F]" />
                                <span className="text-sm font-medium text-foreground">Cash on Delivery (COD)</span>
                            </div>
                        </label>
                    </div>
                </section>

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-6">
                    <Link href="/cart" className="text-sm text-[#AB462F] flex items-center gap-2 hover:opacity-80 font-bold">
                        <ArrowLeft className="w-4 h-4" /> Return to cart
                    </Link>
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-12 h-14 bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold text-sm uppercase tracking-widest rounded-full shadow-lg transition-all">
                        {isLoading ? "Processing..." : (paymentMethod === 'cod' ? "Review Order Details" : "Continue to Payment")}
                    </Button>
                </div>
            </form>
         </div>
      </div>
      
      {/* DESKTOP RIGHT: SUMMARY */}
      {/* MODIFIED: Changed custom background to 'glass' utility. Retained border styles from globals.css/default theme. */}
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
                          <div className="text-right pt-1">
                              <p className="font-bold text-base text-foreground">₱{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-10 pt-8 border-t border-stone-300 dark:border-stone-700">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm text-stone-600 dark:text-stone-300">
                        <span>Subtotal</span>
                        <span className="font-medium text-foreground">₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-stone-600 dark:text-stone-300">
                        <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-stone-400" /> Shipping</span>
                        <span className="font-medium text-[#AB462F]">
                            {shippingCost === null ? "Calculated after address" : (shippingCost === 0 ? "Free" : `₱${shippingCost}`)}
                        </span>
                    </div>
                  </div>

                  <div className="border-t border-stone-300 dark:border-stone-700 mt-6 pt-6 flex justify-between items-baseline">
                      <span className="text-lg font-bold text-foreground">Total</span>
                      <div className="text-right flex items-baseline gap-2">
                          <span className="text-xs text-stone-500 font-semibold tracking-wider">PHP</span>
                          <span className="font-black text-3xl text-[#AB462F] tracking-tight">₱{total.toLocaleString()}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}