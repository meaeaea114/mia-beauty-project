"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { LogOut, Package, MapPin, User, ChevronRight, Loader2, X, CheckCircle2, Clock, Truck, Check, Plus, Trash2 } from "lucide-react"

// --- LOCATION DATA (From your current code) ---
const ADDRESS_DATA = {
    regions: [
        { name: "National Capital Region (NCR)", code: "NCR" },
        { name: "CALABARZON (Region IV-A)", code: "IV-A" },
        { name: "Central Luzon (Region III)", code: "III" },
        { name: "Central Visayas (Region VII)", code: "VII" },
    ],
    provinces: {
        "NCR": ["Metro Manila"],
        "IV-A": ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"],
        "III": ["Bulacan", "Pampanga", "Tarlac", "Zambales"],
        "VII": ["Cebu", "Bohol"]
    },
    cities: {
        "Metro Manila": ["Manila", "Quezon City", "Makati", "Taguig", "Pasig"],
        "Batangas": ["Batangas City", "Lipa City", "Tanauan City", "Sto. Tomas"],
        "Cavite": ["Bacoor", "Dasmarinas", "Imus", "Tagaytay"],
        "Laguna": ["Calamba", "Santa Rosa", "San Pablo"],
        "Cebu": ["Cebu City", "Mandaue", "Lapu-Lapu"],
    }
} as const

// --- TYPES ---
interface Address {
    id: string
    first_name: string
    last_name: string
    phone: string
    address: string
    region: string
    province: string
    city: string
    barangay: string
    postal_code: string
    is_default: boolean
}

interface OrderItem { id: string; name: string; variant: string; price: number; quantity: number; image: string; }
interface Order { 
    id: string; 
    created_at: string; 
    total_amount: number; 
    status: string; 
    items: OrderItem[]; 
    customer_details: {
        address: string
        city: string
        province: string
        region: string
        postalCode: string
        phone: string
        firstName: string
        lastName: string
    } 
}

// --- ORDER TRACKER COMPONENT (Restored full functionality) ---
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
                {/* Grey Background Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-stone-200 dark:bg-white/10 -z-10" />
                
                {/* Active Colored Line */}
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#AB462F] -z-10 transition-all duration-500" 
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isActive = index <= currentStep
                    const isCompleted = index < currentStep
                    const Icon = step.icon

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white dark:bg-[#1a1a1a] px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                isActive 
                                    ? 'border-[#AB462F] bg-[#AB462F] text-white' 
                                    : 'border-stone-300 dark:border-stone-700 text-stone-300 dark:text-stone-700'
                            }`}>
                                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                isActive ? 'text-[#AB462F]' : 'text-stone-400'
                            }`}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function AccountDashboard() {
  const [user, setUser] = useState<{email: string, id: string, firstName?: string, lastName?: string} | null>(null)
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([]) 
  
  // Loading States
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // UI States
  const [activeTab, setActiveTab] = useState("addresses") 
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // Profile Form
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" })
  const [isUpdating, setIsUpdating] = useState(false)

  // Add Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddress, setNewAddress] = useState({
      firstName: "", lastName: "", phone: "", address: "", 
      region: "", province: "", city: "", barangay: "", postalCode: ""
  })
  const [savingAddress, setSavingAddress] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    let mounted = true

    const checkSessionAndLoad = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error || !session) {
                if (mounted) router.replace("/account/login")
                return
            }

            const currentUser = {
                email: session.user.email!,
                id: session.user.id,
                firstName: session.user.user_metadata?.first_name || "",
                lastName: session.user.user_metadata?.last_name || ""
            }

            if(mounted) {
                setUser(currentUser)
                setProfileForm({ firstName: currentUser.firstName, lastName: currentUser.lastName })
            }

            // 1. Fetch Orders
            const { data: orderData } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', currentUser.email)
                .order('created_at', { ascending: false })

            // 2. Fetch Addresses
            const { data: addressData } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })

            if (mounted) {
                setOrders(orderData || [])
                setAddresses(addressData || []) 
                setLoadingOrders(false)
                setLoadingAddresses(false)
                setLoadingAuth(false)
            }

        } catch (error) {
            console.error("Error:", error)
        }
    }

    checkSessionAndLoad()
    return () => { mounted = false }
  }, []) 

  const handleLogout = async () => { 
      await supabase.auth.signOut(); 
      localStorage.removeItem("mia-beauty-profile");
      router.push("/account/login");
  }

  // --- SAVE PROFILE CHANGES (Restored Functionality) ---
  const handleSaveChanges = async () => {
      setIsUpdating(true)
      try {
          const { error } = await supabase.auth.updateUser({
              data: {
                  first_name: profileForm.firstName,
                  last_name: profileForm.lastName
              }
          })

          if (error) throw error

          // Update local state
          setUser(prev => prev ? ({ ...prev, firstName: profileForm.firstName, lastName: profileForm.lastName }) : null)
          
          toast({ title: "Profile Updated", description: "Your details have been saved successfully." })
      } catch (error: any) {
          toast({ title: "Update Failed", description: error.message, variant: "destructive" })
      } finally {
          setIsUpdating(false)
      }
  }

  // --- ADDRESS ACTIONS (From your current code) ---
  const handleAddAddress = async (e: React.FormEvent) => {
      e.preventDefault()
      setSavingAddress(true)

      try {
          const { data, error } = await supabase
              .from('addresses')
              .insert({
                  user_id: user?.id,
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
              })
              .select()

          if (error) throw error

          if (data) {
              setAddresses([data[0], ...addresses])
              setShowAddressModal(false)
              setNewAddress({ firstName: "", lastName: "", phone: "", address: "", region: "", province: "", city: "", barangay: "", postalCode: "" })
              toast({ title: "Success", description: "New address added." })
          }

      } catch (error: any) {
          toast({ title: "Error", description: error.message, variant: "destructive" })
      } finally {
          setSavingAddress(false)
      }
  }

  const handleDeleteAddress = async (id: string) => {
      if(!confirm("Are you sure you want to delete this address?")) return;

      try {
          const { error } = await supabase.from('addresses').delete().eq('id', id)
          if(error) throw error
          setAddresses(addresses.filter(a => a.id !== id))
          toast({ title: "Deleted", description: "Address removed." })
      } catch (error: any) {
          toast({ title: "Error", description: error.message })
      }
  }

  // --- HELPERS ---
  const getProvinces = () => newAddress.region ? ADDRESS_DATA.provinces[newAddress.region as keyof typeof ADDRESS_DATA.provinces] || [] : []
  const getCities = () => newAddress.province ? ADDRESS_DATA.cities[newAddress.province as keyof typeof ADDRESS_DATA.cities] || [] : []

  if (loadingAuth) return <div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="w-8 h-8 animate-spin text-[#AB462F]" /></div>
  if (!user) return null

  // --- VIEWS ---

  // 1. ORDERS VIEW (Added from Source)
  const OrdersView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-normal uppercase tracking-widest mb-6 text-[#AB462F] dark:text-white">Order History</h2>
        
        {loadingOrders ? (
            <div className="flex items-center justify-center py-20 text-stone-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders...
            </div>
        ) : orders.length === 0 ? (
            <div className="border border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-12 text-center">
                <p className="text-stone-500 mb-4">You haven't placed any orders yet.</p>
                <Button onClick={() => router.push("/shop")} variant="outline" className="uppercase text-xs tracking-widest">
                    Start Shopping
                </Button>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="group bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-lg p-6 hover:border-[#AB462F]/50 transition-all">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-sm tracking-wide">#{order.id.slice(0, 12).toUpperCase()}...</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                                        (order.status === 'Completed' || order.status === 'Paid') ? 'bg-green-100 text-green-700 border-green-200' :
                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                        'bg-stone-100 text-stone-600 border-stone-200'
                                    }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500">
                                    {new Date(order.created_at).toLocaleDateString("en-US", {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-serif font-bold text-[#AB462F]">₱{order.total_amount?.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Items Snapshot */}
                        <div className="flex justify-between items-center border-t border-stone-100 dark:border-white/5 pt-4">
                             <div className="flex -space-x-2">
                                {Array.isArray(order.items) && order.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="w-8 h-8 rounded-full border border-white dark:border-stone-900 bg-stone-100 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="w-8 h-8 rounded-full border border-white dark:border-stone-900 bg-stone-200 flex items-center justify-center text-[10px] font-bold">
                                        +{order.items.length - 3}
                                    </div>
                                )}
                             </div>
                             
                             <button 
                                onClick={() => setSelectedOrder(order)}
                                className="text-[10px] font-bold uppercase tracking-widest text-stone-900 dark:text-white hover:text-[#AB462F] flex items-center gap-1"
                             >
                                View Details <ChevronRight className="w-3 h-3" />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  )

  // 2. ADDRESSES VIEW (From your current code)
  const AddressesView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-normal uppercase tracking-widest text-[#AB462F] dark:text-white">Saved Addresses</h2>
            <Button onClick={() => setShowAddressModal(true)} size="sm" className="bg-[#1a1a1a] text-white hover:bg-[#AB462F] uppercase text-[10px] tracking-widest font-bold h-9">
                <Plus className="w-3 h-3 mr-2" /> Add New
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
                <div key={addr.id} className="border border-stone-200 dark:border-stone-800 p-6 rounded-lg relative group bg-white/50 dark:bg-white/5 hover:border-[#AB462F] transition-colors">
                    {addr.is_default && (
                        <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-[#AB462F] text-white px-2 py-1 rounded">Default</span>
                    )}
                    <h3 className="font-bold text-sm mb-2 text-foreground">{addr.first_name} {addr.last_name}</h3>
                    <div className="text-sm text-stone-600 dark:text-stone-400 space-y-0.5 leading-relaxed">
                        <p>{addr.address}</p>
                        <p>{addr.barangay}</p>
                        <p>{addr.city}, {addr.province}</p>
                        <p>{addr.region}, {addr.postal_code}</p>
                        <p className="mt-3 font-mono text-xs flex items-center gap-2"><span className="text-stone-400">Mobile:</span> {addr.phone}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-white/5 flex gap-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs font-bold text-stone-400 hover:text-red-600 flex items-center gap-1">
                             <Trash2 className="w-3 h-3" /> Delete
                         </button>
                    </div>
                </div>
            ))}
            {addresses.length === 0 && (
                <div className="col-span-full border border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-8 text-center text-stone-500">
                    <p className="text-sm">No addresses saved yet.</p>
                </div>
            )}
        </div>
    </div>
  )

  // 3. PROFILE VIEW (Added from Source)
  const ProfileView = () => (
    <div className="space-y-8 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-normal uppercase tracking-widest mb-6 text-[#AB462F] dark:text-white">Account Details</h2>
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                <div className="w-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm text-stone-500 cursor-not-allowed">
                    {user?.email}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">First Name</label>
                    <input 
                        type="text" 
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        className="w-full bg-transparent border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:border-[#AB462F] outline-none dark:text-white" 
                    />
                </div>
                <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Last Name</label>
                     <input 
                        type="text" 
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        className="w-full bg-transparent border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:border-[#AB462F] outline-none dark:text-white" 
                     />
                </div>
            </div>
            <Button 
                onClick={handleSaveChanges}
                disabled={isUpdating}
                className="w-full md:w-auto mt-4 bg-[#AB462F] hover:bg-[#8f3a26] text-white rounded-full uppercase text-xs font-bold tracking-widest h-12 px-8"
            >
                {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-transparent pt-32 pb-20 px-4 md:px-8 font-sans text-[#1a1a1a] dark:text-white">
        
        {/* --- ORDER DETAILS MODAL (Added from Source) --- */}
        {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-white/10 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Order Details</h3>
                            <p className="text-stone-500 text-xs uppercase tracking-widest">#{selectedOrder.id}</p>
                        </div>

                        {/* Tracker */}
                        <div className="mb-10">
                            <OrderTracker status={selectedOrder.status || 'pending'} />
                        </div>

                        {/* Items */}
                        <div className="space-y-4 mb-8">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center p-3 border border-stone-100 dark:border-white/5 rounded-lg bg-stone-50/50 dark:bg-black/20">
                                    <div className="w-12 h-12 bg-white rounded border border-stone-200 p-1">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-xs uppercase text-foreground">{item.name}</h4>
                                        <p className="text-[10px] text-stone-500">{item.variant}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">₱{item.price.toLocaleString()}</p>
                                        <p className="text-[10px] text-stone-500">x{item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Summary */}
                        <div className="border-t border-stone-200 dark:border-white/10 pt-6 grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-stone-400">Delivery Address</h4>
                                <div className="text-sm space-y-1 text-stone-700 dark:text-stone-300">
                                    <p className="font-bold text-foreground">{selectedOrder.customer_details.firstName} {selectedOrder.customer_details.lastName}</p>
                                    <p>{selectedOrder.customer_details.address}</p>
                                    <p>{selectedOrder.customer_details.city}, {selectedOrder.customer_details.province}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Total Amount</span>
                                    <span className="font-black text-lg text-[#AB462F]">₱{selectedOrder.total_amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-stone-500">Status</span>
                                    <span className="font-bold uppercase">{selectedOrder.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- ADD ADDRESS MODAL (From Current Code) --- */}
        {showAddressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-black/20">
                        <h3 className="font-bold text-lg uppercase tracking-tight">New Address</h3>
                        <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="address-form" onSubmit={handleAddAddress} className="space-y-4">
                            {/* ... Address Form Inputs ... */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">First Name</label>
                                <input required className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent" 
                                value={newAddress.firstName} onChange={e => setNewAddress({...newAddress, firstName: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">Last Name</label>
                                <input required className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent" 
                                value={newAddress.lastName} onChange={e => setNewAddress({...newAddress, lastName: e.target.value})} /></div>
                            </div>

                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">Region</label>
                            <select required className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent" 
                                value={newAddress.region} onChange={e => setNewAddress({...newAddress, region: e.target.value, province: '', city: ''})}>
                                <option value="">Select Region</option>
                                {ADDRESS_DATA.regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                            </select></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">Province</label>
                                <select required disabled={!newAddress.region} className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent disabled:bg-stone-100" 
                                    value={newAddress.province} onChange={e => setNewAddress({...newAddress, province: e.target.value, city: ''})}>
                                    <option value="">Select Province</option>
                                    {getProvinces().map((p: any) => <option key={p} value={p}>{p}</option>)}
                                </select></div>
                                
                                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">City</label>
                                <select required disabled={!newAddress.province} className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent disabled:bg-stone-100" 
                                    value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}>
                                    <option value="">Select City</option>
                                    {getCities().map((c: any) => <option key={c} value={c}>{c}</option>)}
                                </select></div>
                            </div>

                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">Barangay</label>
                            <input required className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent" 
                            value={newAddress.barangay} onChange={e => setNewAddress({...newAddress, barangay: e.target.value})} /></div>

                            <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">Street Address</label>
                            <input required className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent" placeholder="House No., Street Name"
                            value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} /></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">Postal Code</label>
                                <input required className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent" 
                                value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-stone-400">Phone</label>
                                <input required className="w-full border border-stone-200 rounded px-3 py-2 text-sm bg-transparent" 
                                value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} /></div>
                            </div>
                        </form>
                    </div>
                    
                    <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-black/20 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowAddressModal(false)} className="uppercase text-xs font-bold tracking-widest text-stone-500">Cancel</Button>
                        <Button type="submit" form="address-form" disabled={savingAddress} className="bg-[#AB462F] hover:bg-[#8f3a26] text-white rounded-full uppercase text-xs font-bold tracking-widest px-8">
                            {savingAddress ? "Saving..." : "Save Address"}
                        </Button>
                    </div>
                </div>
            </div>
        )}

        <div className="max-w-6xl mx-auto">
            <header className="mb-12 border-b border-stone-200 dark:border-white/10 pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-2 text-foreground">Hi, {user.firstName}</h1>
                    <p className="text-stone-500 text-sm">Manage your addresses and orders.</p>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-xs uppercase tracking-widest font-bold text-stone-400 hover:text-[#AB462F] p-0 h-auto"><LogOut className="w-4 h-4 mr-2" /> Log Out</Button>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
                <nav className="w-full lg:w-64 flex-shrink-0 space-y-1">
                    {[
                        { id: 'orders', label: 'My Orders', icon: Package },
                        { id: 'addresses', label: 'Addresses', icon: MapPin },
                        { id: 'profile', label: 'Account Details', icon: User },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === item.id ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black shadow-lg' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10'}`}>
                            <span className="flex items-center gap-3"><item.icon className="w-4 h-4" />{item.label}</span>
                            {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                        </button>
                    ))}
                </nav>
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