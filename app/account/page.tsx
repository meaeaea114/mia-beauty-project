"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
// FIREBASE IMPORTS
import { auth } from "@/lib/firebase" 
import { onAuthStateChanged, signOut } from "firebase/auth"
// FIX: Added 'Lock' to the imports below
import { LogOut, Package, MapPin, User, ChevronRight, Loader2, X, CheckCircle2, Clock, Truck, Check, Plus, Trash2, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

// --- TYPES ---
interface Address {
    id: string; first_name: string; last_name: string; phone: string; address: string; 
    region: string; province: string; city: string; barangay: string; postal_code: string; is_default: boolean;
}
interface OrderItem { id: string; name: string; variant: string; price: number; quantity: number; image: string; }
interface Order { 
    id: string; created_at: string; total_amount: number; status: string; items: OrderItem[]; 
    customer_details: any; 
    payment_method?: string;
}

// Helper to check for a basic UUID structure (prevents Firebase UIDs from crashing Supabase UUID column)
const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// --- ORDER TRACKER COMPONENT ---
const OrderTracker = ({ status }: { status: string }) => {
    const steps = [
        { id: 'pending', label: 'Order Placed', icon: Clock },
        { id: 'processing', label: 'Processing', icon: Package },
        { id: 'shipped', label: 'In Transit', icon: Truck },
        { id: 'completed', label: 'Delivered', icon: CheckCircle2 }
    ]

    const getCurrentStepIndex = () => {
        const s = status ? status.toLowerCase() : ''
        if (s === 'completed' || s === 'delivered') return 3
        if (s === 'shipped' || s === 'out for delivery') return 2
        if (s === 'processing' || s === 'confirmed' || s === 'paid') return 1
        return 0 
    }
    const currentStep = getCurrentStepIndex()

    return (
        <div className="w-full py-6 px-2">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-stone-200 dark:bg-white/10 -z-10" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#AB462F] -z-10 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
                {steps.map((step, index) => {
                    const isActive = index <= currentStep
                    const isCompleted = index < currentStep
                    const Icon = step.icon
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white dark:bg-[#1a1a1a] px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-[#AB462F] bg-[#AB462F] text-white' : 'border-stone-300 dark:border-stone-700 text-stone-300 dark:text-stone-700'}`}>
                                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-[#AB462F]' : 'text-stone-400'}`}>{step.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function AccountDashboard() {
  const [user, setUser] = useState<any>(null)
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  
  // Loading States
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // UI States
  const [activeTab, setActiveTab] = useState("orders") 
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // Profile Form
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" })
  const [isUpdating, setIsUpdating] = useState(false)

  // Address Modal
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddress, setNewAddress] = useState({ firstName: "", lastName: "", phone: "", address: "", region: "", province: "", city: "", barangay: "", postalCode: "" })
  const [savingAddress, setSavingAddress] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // 1. FIXED AUTH CHECK LOGIC
  useEffect(() => {
    let mounted = true
    let firebaseUnsub: any;

    const loadUserData = async (email: string, uid: string, firstName: string, lastName: string) => {
        if (!mounted) return;
        
        setUser({ email, id: uid, firstName, lastName })
        setProfileForm({ firstName, lastName })

        try {
            // Fetch Orders
            const { data: orderData } = await supabase.from('orders')
                .select('*').eq('customer_email', email).order('created_at', { ascending: false })
            
            // Fetch Addresses - ONLY FETCH if ID is a Supabase UUID
            let addressData = []
            if (isUuid(uid)) { 
                const { data: fetchedAddresses } = await supabase.from('addresses')
                    .select('*').eq('user_id', uid).order('created_at', { ascending: false })
                addressData = fetchedAddresses || []
            }


            if (mounted) {
                setOrders(orderData || [])
                setAddresses(addressData)
                setLoadingOrders(false)
                setLoadingAuth(false) // AUTH SUCCESS
            }
        } catch (e) {
            console.error(e)
            if (mounted) setLoadingAuth(false)
        }
    }

    const initAuth = async () => {
        // Step 1: Check Supabase (Manual Login)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
            loadUserData(
                session.user.email!, 
                session.user.id, 
                session.user.user_metadata?.first_name || "", 
                session.user.user_metadata?.last_name || ""
            )
            return; 
        }

        // Step 2: Check Firebase (Google Login) - Only if Supabase failed
        firebaseUnsub = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const splitName = firebaseUser.displayName ? firebaseUser.displayName.split(" ") : ["User", ""]
                loadUserData(
                    firebaseUser.email!, 
                    firebaseUser.uid, 
                    splitName[0], 
                    splitName.slice(1).join(" ")
                )
            } else {
                if (mounted) {
                    router.replace("/account/login")
                }
            }
        })
    }

    initAuth()

    return () => { 
        mounted = false
        if (firebaseUnsub) firebaseUnsub()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut() 
    await signOut(auth)           
    localStorage.removeItem("mia-profile")
      router.push("/account/login")
  }

  // --- ADDRESS ACTIONS ---
  
  const handleSelectSavedAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addressId = e.target.value
        if (!addressId || addressId === '') return 

        const selected = addresses.find(a => a.id === addressId)
        if (selected) {
            // Populate the newAddress state with the selected address data
            setNewAddress({
                firstName: selected.first_name,
                lastName: selected.last_name,
                phone: selected.phone,
                address: selected.address,
                region: selected.region,
                province: selected.province,
                city: selected.city,
                barangay: selected.barangay,
                postalCode: selected.postal_code,
            })
            setShowAddressModal(true) // Open the modal pre-filled with the selected address
            toast({ title: "Address Loaded", description: `${selected.city} details loaded for editing.` })
        }
    }

  const handleSaveChanges = async () => {
      setIsUpdating(true)
      try {
          const { error } = await supabase.auth.updateUser({
              data: { first_name: profileForm.firstName, last_name: profileForm.lastName }
          })
          if (error) throw error
          setUser((prev: any) => ({ ...prev, firstName: profileForm.firstName, lastName: profileForm.lastName }))
          toast({ title: "Profile Updated", description: "Your details have been saved." })
      } catch (error) {
          toast({ title: "Note", description: "Google account details cannot be changed here." })
      } finally {
          setIsUpdating(false)
      }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
      e.preventDefault()
      
      const userId = user?.id;
      
      // CRITICAL FIX: Block non-UUID user IDs (like Firebase UIDs) from inserting into a UUID column.
      if (!userId || !isUuid(userId)) {
          toast({ 
              title: "Error Saving Address", 
              description: "Address saving is currently only supported for accounts signed up with email/password (Supabase). Please use a different checkout method if logged in via Google.", 
              variant: "destructive" 
          });
          return;
      }
      
      setSavingAddress(true)
      try {
          const { data, error } = await supabase.from('addresses').insert({
              user_id: userId,
              first_name: newAddress.firstName,
              last_name: newAddress.lastName,
              phone: newAddress.phone,
              address: newAddress.address,
              region: newAddress.region,
              province: newAddress.province,
              city: newAddress.city,
              barangay: newAddress.barangay,
              postal_code: newAddress.postalCode,
              is_default: addresses.length === 0
          }).select()

          if (error) throw error
          if (data) {
              setAddresses([data[0], ...addresses])
              setShowAddressModal(false)
              setNewAddress({ firstName: "", lastName: "", phone: "", address: "", region: "", province: "", city: "", barangay: "", postalCode: "" })
              toast({ title: "Success", description: "New address added." })
          }
      } catch (error: any) {
          toast({ title: "Error", description: "Could not save address. " + error.message })
      } finally {
          setSavingAddress(false)
      }
  }

  const handleDeleteAddress = async (id: string) => {
      if(!confirm("Delete this address?")) return;
      try {
          const { error } = await supabase.from('addresses').delete().eq('id', id)
          if(error) throw error
          setAddresses(addresses.filter(a => a.id !== id))
          toast({ title: "Deleted", description: "Address removed." })
      } catch (error: any) { toast({ title: "Error", description: error.message }) }
  }

  // --- HELPERS ---
  // @ts-ignore
  const getProvinces = () => newAddress.region ? PHILIPPINE_ADDRESS_DATA.provinces[newAddress.region] || [] : []
  // @ts-ignore
  const getCities = () => newAddress.province ? PHILIPPINE_ADDRESS_DATA.cities[newAddress.province] || [] : []

  // --- VIEWS ---
  
  // 1. ORDERS VIEW
  const OrdersView = () => (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-6">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Recent Orders</h2>
        </div>
        
        {loadingOrders ? (
            <div className="flex items-center justify-center py-20 text-stone-400"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>
        ) : orders.length === 0 ? (
            <div className="bg-white/50 dark:bg-white/5 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-12 text-center">
                <Package className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 mb-6 text-sm">You haven't placed any orders yet.</p>
                <Button onClick={() => router.push("/shop")} className="bg-[#1a1a1a] hover:bg-[#AB462F] text-white rounded-full uppercase text-[10px] tracking-widest h-10 px-6">Start Shopping</Button>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="group bg-white/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-lg hover:border-[#AB462F]/30 transition-all cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-sm text-[#1a1a1a] dark:text-white">#{order.id.slice(0, 8)}...</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest border ${
                                        (order.status === 'Completed' || order.status === 'Paid') ? 'bg-green-100 text-green-700 border-green-200' :
                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                        'bg-stone-100 text-stone-600 border-stone-200'
                                    }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                                <div className="flex -space-x-3">
                                    {Array.isArray(order.items) && order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a1a1a] bg-stone-100 overflow-hidden shadow-sm">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a1a1a] bg-stone-100 flex items-center justify-center text-[9px] font-bold text-stone-500">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="text-sm font-bold text-[#1a1a1a] dark:text-white">₱{order.total_amount?.toLocaleString()}</p>
                                    <span className="text-[10px] text-[#AB462F] font-bold uppercase tracking-widest group-hover:underline flex items-center justify-end gap-1">Details <ChevronRight className="w-3 h-3" /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </motion.div>
  )

  // 2. ADDRESSES VIEW
  const AddressesView = () => (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-6">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Saved Locations</h2>
            <Button 
                onClick={() => {
                    if (user?.id && !isUuid(user.id)) {
                        toast({ title: "Access Denied", description: "Address management requires an email/password account.", variant: "destructive" });
                    } else {
                        // Clear the form before opening for a new address
                        setNewAddress({ firstName: user?.firstName || "", lastName: user?.lastName || "", phone: "", address: "", region: "", province: "", city: "", barangay: "", postalCode: "" });
                        setShowAddressModal(true);
                    }
                }} 
                size="sm" 
                className="bg-[#AB462F] hover:bg-[#8f3a26] text-white rounded-full uppercase text-[9px] tracking-widest font-bold h-8"
            >
                <Plus className="w-3 h-3 mr-1" /> Add New
            </Button>
        </div>
        
        {/* NEW: SAVED ADDRESS DROP-DOWN ALERT BOX */}
        {addresses.length > 0 && (
            <div className="p-4 bg-white dark:bg-black/40 border border-[#AB462F]/20 rounded-xl shadow-sm flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#AB462F]/10 flex items-center justify-center text-[#AB462F]"><MapPin className="w-4 h-4" /></div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-stone-700 dark:text-stone-200">Load Existing Address</p>
                        <p className="text-[10px] text-stone-500">Select an address to view or edit.</p>
                    </div>
                </div>
                <select 
                    className="bg-transparent text-xs font-bold text-[#AB462F] outline-none cursor-pointer text-right"
                    onChange={handleSelectSavedAddress}
                    defaultValue=""
                >
                    <option value="" disabled>Select...</option>
                    {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>{addr.first_name} ({addr.city})</option>
                    ))}
                </select>
            </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
                <div key={addr.id} className="bg-white/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 p-6 rounded-2xl relative group hover:shadow-md transition-all">
                    {addr.is_default && <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-stone-100 dark:bg-white/10 text-stone-500 px-2 py-1 rounded-full">Default</span>}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#AB462F]/10 flex items-center justify-center text-[#AB462F]"><MapPin className="w-4 h-4" /></div>
                        <h3 className="font-bold text-sm text-[#1a1a1a] dark:text-white">{addr.first_name} {addr.last_name}</h3>
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1 pl-11 leading-relaxed">
                        <p>{addr.address}, {addr.barangay}</p>
                        <p>{addr.city}, {addr.province}</p>
                        <p className="font-mono text-stone-400">{addr.postal_code}</p>
                        <p className="pt-2 font-bold text-[#1a1a1a] dark:text-white">{addr.phone}</p>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="absolute bottom-6 right-6 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            {addresses.length === 0 && (
                <div className="col-span-full border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-8 text-center text-stone-500 text-sm">
                    No addresses saved yet.
                </div>
            )}
        </div>
    </motion.div>
  )

  // 3. PROFILE VIEW
  const ProfileView = () => (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="max-w-lg">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">Personal Information</h2>
        
        <div className="bg-white/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-8 space-y-6">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                <div className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-white/5 rounded-lg px-4 py-3 text-sm text-stone-500 cursor-not-allowed flex items-center justify-between">
                    {user?.email}
                    {/* Fixed: Lock imported at top */}
                    <Lock className="w-3 h-3 opacity-50" />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">First Name</label>
                    <input 
                        type="text" 
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-300 dark:border-stone-700 focus:border-[#AB462F] py-2 text-sm text-[#1a1a1a] dark:text-white outline-none transition-colors"
                    />
                </div>
                <div className="space-y-1.5">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Last Name</label>
                     <input 
                        type="text" 
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-300 dark:border-stone-700 focus:border-[#AB462F] py-2 text-sm text-[#1a1a1a] dark:text-white outline-none transition-colors" 
                     />
                </div>
            </div>

            <div className="pt-4">
                <Button 
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    className="bg-[#1a1a1a] hover:bg-[#AB462F] text-white rounded-full uppercase text-[10px] font-bold tracking-widest h-10 px-8 shadow-lg transition-all w-full md:w-auto"
                >
                    {isUpdating ? "Saving..." : "Update Profile"}
                </Button>
            </div>
        </div>
    </motion.div>
  )

  if (loadingAuth) return <div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="w-8 h-8 animate-spin text-[#AB462F]" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen w-full bg-transparent pt-32 pb-20 px-4 md:px-8 font-sans text-[#1a1a1a] dark:text-white">
        
        {/* ORDER DETAILS MODAL */}
        <AnimatePresence>
        {selectedOrder && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-white dark:bg-[#121212] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-white/10">
                    
                    {/* Modal Header */}
                    <div className="bg-[#FAF9F6] dark:bg-white/5 px-8 py-6 border-b border-stone-100 dark:border-white/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-[#1a1a1a] dark:text-white">Order Details</h3>
                            <p className="text-stone-400 text-[10px] uppercase tracking-widest font-mono">#{selectedOrder.id}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-stone-200 dark:hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-stone-500" /></button>
                    </div>

                    <div className="p-8 max-h-[70vh] overflow-y-auto">
                        <div className="mb-8"><OrderTracker status={selectedOrder.status} /></div>
                        
                        <div className="space-y-3 mb-8">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-14 h-14 bg-white rounded-lg border border-stone-100 p-1 shrink-0 overflow-hidden"><img src={item.image} alt={item.name} className="w-full h-full object-contain" /></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-xs uppercase text-[#1a1a1a] dark:text-white">{item.name}</h4>
                                        <p className="text-[10px] text-stone-500 uppercase tracking-wider">{item.variant}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-[#1a1a1a] dark:text-white">₱{item.price.toLocaleString()}</p>
                                        <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-stone-50 dark:bg-white/5 rounded-2xl p-6 grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-[10px] uppercase tracking-widest mb-3 text-stone-400">Shipping To</h4>
                                <div className="text-xs space-y-1 text-stone-600 dark:text-stone-300">
                                    <p className="font-bold text-[#1a1a1a] dark:text-white">{selectedOrder.customer_details.firstName} {selectedOrder.customer_details.lastName}</p>
                                    <p>{selectedOrder.customer_details.address}</p>
                                    <p>{selectedOrder.customer_details.city}, {selectedOrder.customer_details.province}</p>
                                    <p className="pt-1 text-stone-400">{selectedOrder.customer_details.phone}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="flex justify-between text-xs text-stone-500"><span>Payment</span><span className="font-medium text-[#1a1a1a] dark:text-white">{selectedOrder.payment_method || 'COD'}</span></div>
                                <div className="flex justify-between text-xs text-stone-500"><span>Status</span><span className="font-bold uppercase text-[#1a1a1a] dark:text-white">{selectedOrder.status}</span></div>
                                <div className="pt-3 flex justify-between items-baseline border-t border-stone-200 dark:border-white/10 mt-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total</span>
                                    <span className="font-black text-xl text-[#AB462F]">₱{selectedOrder.total_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* ADDRESS FORM MODAL */}
        <AnimatePresence>
        {showAddressModal && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-white dark:bg-[#1a1a1a] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="p-6 border-b border-stone-100 dark:border-white/5 flex justify-between items-center bg-[#FAF9F6] dark:bg-white/5">
                        <h3 className="font-black text-lg uppercase tracking-tight text-[#1a1a1a] dark:text-white">New Location</h3>
                        <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-stone-200 dark:hover:bg-white/10 rounded-full transition-colors"><X className="w-4 h-4 text-stone-500" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        <form id="address-form" onSubmit={handleAddAddress} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">First Name</label><input required className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors" value={newAddress.firstName} onChange={e => setNewAddress({...newAddress, firstName: e.target.value})} /></div>
                                <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Last Name</label><input required className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors" value={newAddress.lastName} onChange={e => setNewAddress({...newAddress, lastName: e.target.value})} /></div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Region</label>
                                <select required className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors cursor-pointer" value={newAddress.region} onChange={e => setNewAddress({...newAddress, region: e.target.value, province: '', city: ''})}>
                                    <option value="" className="text-black">Select Region</option>
                                    {PHILIPPINE_ADDRESS_DATA.regions.map(r => <option key={r.code} value={r.code} className="text-black">{r.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Province</label><select required disabled={!newAddress.region} className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors disabled:opacity-50" value={newAddress.province} onChange={e => setNewAddress({...newAddress, province: e.target.value, city: ''})}><option value="" className="text-black">Select Province</option>{getProvinces().map((p: any) => <option key={p} value={p} className="text-black">{p}</option>)}</select></div>
                                <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">City</label><select required disabled={!newAddress.province} className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors disabled:opacity-50" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}><option value="" className="text-black">Select City</option>{getCities().map((c: any) => <option key={c} value={c} className="text-black">{c}</option>)}</select></div>
                            </div>

                            <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Barangay</label><input required className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors" value={newAddress.barangay} onChange={e => setNewAddress({...newAddress, barangay: e.target.value})} /></div>
                            <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Street Address</label><input required className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} /></div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Postal Code</label><input required className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} /></div>
                                <div className="space-y-1.5"><label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Mobile Number</label><input required className="w-full border-b border-stone-300 dark:border-stone-700 bg-transparent py-2 text-sm outline-none focus:border-[#AB462F] transition-colors" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} /></div>
                            </div>
                        </form>
                    </div>
                    <div className="p-6 border-t border-stone-100 dark:border-white/5 flex justify-end gap-3 bg-[#FAF9F6] dark:bg-white/5">
                        <Button variant="ghost" onClick={() => setShowAddressModal(false)} className="text-xs uppercase font-bold tracking-widest text-stone-500 hover:text-stone-800">Cancel</Button>
                        <Button type="submit" form="address-form" disabled={savingAddress} className="bg-[#1a1a1a] text-white hover:bg-[#AB462F] rounded-full uppercase text-[10px] font-bold tracking-widest px-6 shadow-lg">Save Address</Button>
                    </div>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-12 md:mb-16 border-b border-stone-200 dark:border-white/10 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a] dark:text-white leading-[0.9] mb-3">
                        Hi, <span className="font-serif italic font-normal text-[#AB462F] lowercase tracking-normal">{user.firstName || 'Beauty'}</span>
                    </h1>
                    <p className="text-stone-500 text-sm md:text-base font-light">Welcome back to your personal dashboard.</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="text-[10px] uppercase font-bold tracking-widest border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 h-10 px-6 rounded-full"><LogOut className="w-3 h-3 mr-2" /> Sign Out</Button>
            </header>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Navigation Sidebar */}
                <nav className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {[
                        { id: 'orders', label: 'My Orders', icon: Package }, 
                        { id: 'addresses', label: 'Addresses', icon: MapPin }, 
                        { id: 'profile', label: 'Account Details', icon: User }
                    ].map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)} 
                            className={`w-full flex items-center justify-between px-5 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${
                                activeTab === item.id 
                                ? 'bg-[#1a1a1a] text-white shadow-lg scale-[1.02]' 
                                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10 hover:pl-6'
                            }`}
                        >
                            <span className="flex items-center gap-3"><item.icon className="w-4 h-4" />{item.label}</span>
                            {activeTab === item.id && <ChevronRight className="w-3 h-3" />}
                        </button>
                    ))}
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 min-h-[500px]">
                    {activeTab === 'orders' && <OrdersView />}
                    {activeTab === 'addresses' && <AddressesView />}
                    {activeTab === 'profile' && <ProfileView />}
                </main>
            </div>
        </div>
    </div>
  )
}