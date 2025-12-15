"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { ShoppingBag, Moon, Sun, Menu, Search, User, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/context/cart-context"
// AUTH IMPORTS
import { supabase } from "@/lib/supabase"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

// --- COMPLETE SEARCH DATA INDEX ---
const SEARCH_INDEX = [
  // LIPS
  { id: "l1", name: "Fluffmatte", category: "Lips", price: 399, image: "/images/Rectangle 131.png" },
  { id: "l4", name: "Juicetint", category: "Lips", price: 299, image: "/images/Rectangle 134.png" },
  { id: "l2", name: "Fluffbalm", category: "Lips", price: 399, image: "/images/Rectangle 131.png" },
  { id: "l3", name: "Glidegloss", category: "Lips", price: 350, image: "/images/Rectangle 133.png" },
  { id: "l5", name: "Lip Dip", category: "Lips", price: 299, image: "/images/Rectangle 129-1.png" },
  { id: "l6", name: "Staygloss", category: "Lips", price: 595, image: "/images/Rectangle 141.png" },
  
  // CHEEKS
  { id: "c1", name: "Airblush", category: "Cheeks", price: 359, image: "/images/Rectangle 150.png" },
  { id: "c2", name: "Blush Duo", category: "Cheeks", price: 400, image: "/images/Rectangle 145.png" },
  { id: "c3", name: "Blush On", category: "Cheeks", price: 359, image: "/images/Rectangle 146.png" },
  { id: "c4", name: "Bronzer Duo", category: "Cheeks", price: 400, image: "/images/Rectangle 144.png" },
  { id: "c5", name: "Glow On", category: "Cheeks", price: 359, image: "/images/Rectangle 145-1.png" },

  // FACE
  { id: "f1", name: "Tinted Moisturizer", category: "Face", price: 430, image: "/images/Rectangle 147.png" },
  { id: "f2", name: "Base Booster", category: "Face", price: 500, image: "/images/Rectangle 144-1.png" },
  { id: "f7", name: "The Blotting Powder", category: "Face", price: 499, image: "/images/Rectangle 144-2.png" },
  { id: "f5", name: "The Concealer", category: "Face", price: 339, image: "/images/Rectangle 145-2.png" },
  { id: "f6", name: "The Multistick", category: "Face", price: 399, image: "/images/Rectangle 146-1.png" },
  { id: "f3", name: "Dream Cream", category: "Face", price: 500, image: "/images/Rectangle 144-3.png" },
  { id: "s1", name: "Dream Serum", category: "Face", price: 500, image: "/images/Rectangle 144-4.png" },
  { id: "f4", name: "Sun Safe", category: "Face", price: 350, image: "/images/Rectangle 145-3.png" },

  // EYES
  { id: "e1", name: "Easyline", category: "Eyes", price: 299, image: "/images/Rectangle 144-5.png" },
  { id: "e2", name: "Eyecrayon", category: "Eyes", price: 299, image: "/images/Rectangle 145-4.png" },
  { id: "e3", name: "Eyeshadow Palette", category: "Eyes", price: 400, image: "/images/Rectangle 144-6.png" },
  { id: "e4", name: "Lash Seeker", category: "Eyes", price: 359, image: "/images/Rectangle 146-2.png" },
  { id: "e5", name: "Lashlift", category: "Eyes", price: 359, image: "/images/Rectangle 147-1.png" },
  { id: "e6", name: "Velvet Liner", category: "Eyes", price: 445, image: "/images/Rectangle 70.png" },

  // BROWS
  { id: "b1", name: "Grooming Gel", category: "Brows", price: 389, image: "/images/Rectangle 144-7.png" },
  { id: "b2", name: "Micromarker", category: "Brows", price: 300, image: "/images/Rectangle 144-8.png" },
  { id: "b3", name: "Pomade Pencil", category: "Brows", price: 200, image: "/images/Rectangle 146-3.png" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)
  
  // UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false) // For Mobile Overlay
  const [isSearchFocused, setIsSearchFocused] = useState(false) // For Desktop Dropdown
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Auth State

  const { 
    setIsCartOpen, 
    totalItems 
  } = useCart()

  // Search Logic States
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(SEARCH_INDEX)

  const { toast } = useToast()
  const router = useRouter()

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle Theme Logic
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Handle Auth Logic
  const checkAuth = () => {
    const user = localStorage.getItem("mia-profile")
    setIsLoggedIn(!!user)
  }

  useEffect(() => {
    checkAuth()
    window.addEventListener("storage", checkAuth)
    window.addEventListener("auth-change", checkAuth)
    return () => {
        window.removeEventListener("storage", checkAuth)
        window.removeEventListener("auth-change", checkAuth)
    }
  }, [])

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    await signOut(auth)
    localStorage.removeItem("mia-profile")
    setIsLoggedIn(false)
    setIsMobileMenuOpen(false)
    router.push("/account/login")
    window.dispatchEvent(new Event("storage"))
  }

  // Search Filter Logic
  useEffect(() => {
    if (query === "") {
      setResults([]) 
    } else {
      const filtered = SEARCH_INDEX.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    }
  }, [query])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  // --- NAVIGATION LOGIC ---
  const handleSearchResultClick = (item: typeof SEARCH_INDEX[0]) => {
    setIsSearchOpen(false)
    setIsSearchFocused(false) // Close desktop dropdown
    setQuery("") 
    
    toast({
      title: "Opening Product",
      description: `Viewing ${item.name}...`, 
      duration: 800
    })

    router.push(`/shop?q=${encodeURIComponent(item.name)}`)
  }

  // Handle "Enter" key for global search
  const handleGlobalSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if(query.trim()) {
          setIsSearchOpen(false)
          setIsSearchFocused(false)
          router.push(`/shop?q=${encodeURIComponent(query)}`)
      }
  }

  if (!mounted) return null

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-white/95 dark:bg-black/95 backdrop-blur-md py-4 border-b border-stone-200/50 dark:border-white/10" 
            : "bg-transparent py-6 border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 relative flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <div className="md:hidden z-50">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-transparent"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
          </div>

          {/* LEFT: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors">Home</Link>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors">Shop</Link>
            <Link href="/best-sellers" className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors">Best Seller</Link>
            <Link href="#footer" className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors">About</Link>
          </nav>

          {/* CENTER: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <a href="/" className="text-3xl font-serif font-bold tracking-tight text-[#C6A87C] hover:opacity-80 transition-opacity">
              MIA
            </a>
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-4 z-50">
            
            {/* --- DESKTOP SEARCH BAR (LIVE) --- */}
            <div className="relative w-64 lg:w-72">
                 <form onSubmit={handleGlobalSearch} className="relative z-10">
                    <div className={`flex items-center rounded-full px-4 py-2 transition-all duration-300 ${isSearchFocused || query ? 'bg-stone-100 dark:bg-white/10 ring-1 ring-[#AB462F]/20' : 'bg-transparent hover:bg-stone-100 dark:hover:bg-white/5'}`}>
                        <input 
                            type="text" 
                            placeholder="SEARCH..." 
                            className="bg-transparent border-none outline-none text-xs font-bold w-full placeholder:text-stone-400 placeholder:font-normal uppercase tracking-wider"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} 
                        />
                        <button type="submit">
                            <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-[#AB462F]' : 'text-stone-400'}`} />
                        </button>
                    </div>
                 </form>

                 {/* --- DROPDOWN RESULTS --- */}
                 <div className={`absolute top-full right-0 mt-4 w-[350px] bg-white/90 dark:bg-[#121212]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-200/50 dark:border-white/10 overflow-hidden transition-all duration-300 origin-top-right ${isSearchFocused && query.length > 0 ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                     <div className="max-h-[350px] overflow-y-auto py-2">
                        {results.length > 0 ? (
                            <>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 px-5 py-2">Products</p>
                                {results.slice(0, 5).map(item => (
                                    <div 
                                            key={item.id}
                                            onMouseDown={(e) => { e.preventDefault(); handleSearchResultClick(item); }}
                                            className="group flex items-center gap-4 px-5 py-3 hover:bg-[#AB462F]/5 cursor-pointer transition-all duration-200 border-b border-dashed border-stone-100 dark:border-stone-800/50 last:border-0"
                                    >
                                            <div className="h-12 w-12 bg-stone-100 dark:bg-white/5 shrink-0 rounded-lg overflow-hidden border border-stone-200 dark:border-white/10 group-hover:border-[#AB462F]/20 transition-colors">
                                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold uppercase truncate text-foreground group-hover:text-[#AB462F] transition-colors">{item.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.category}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-semibold text-foreground">₱{item.price}</span>
                                                <ChevronRight className="w-3 h-3 text-stone-300 group-hover:text-[#AB462F] group-hover:translate-x-1 transition-all" />
                                            </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm font-medium text-stone-500 mb-1">No matches found</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Try "Lipstick"</p>
                            </div>
                        )}
                     </div>
                 </div>
            </div>

            {/* User Icon - Updated with Auth Logic */}
            <Link href={isLoggedIn ? "/account" : "/account/login"}>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart Trigger (Just sets state, doesn't render cart) */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-black/5 dark:hover:bg-white/10 relative"
                onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                 <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#AB462F] rounded-full animate-in zoom-in" />
              )}
            </Button>

            <div className="w-px h-4 bg-foreground/20 mx-2" />
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-black/5 dark:hover:bg-white/10">
               <div className="relative h-5 w-5">
                  <Sun className={`absolute h-full w-full transition-all ${theme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'} text-amber-600`} />
                  <Moon className={`absolute h-full w-full transition-all ${theme === 'light' ? 'scale-0 -rotate-90' : 'scale-100 rotate-0'} text-foreground`} />
               </div>
            </Button>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center gap-2 z-50">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                 <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                     <div className="absolute top-2 right-2 h-2 w-2 bg-[#AB462F] rounded-full" />
                  )}
              </Button>
          </div>

        </div>
      </header>

      {/* --- MOBILE SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl pt-32 px-4 md:px-8 overflow-y-auto md:hidden"
            >
                <div className="container mx-auto max-w-4xl">
                    <form onSubmit={handleGlobalSearch} className="relative border-b-2 border-stone-200 dark:border-stone-800 pb-2 mb-10">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="SEARCH..." 
                            className="w-full bg-transparent border-none pl-12 pr-4 py-4 text-2xl font-black uppercase tracking-tight placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 text-foreground"
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                         <button type="button" onClick={() => setQuery("")} className={`absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold uppercase tracking-widest text-muted-foreground ${query ? 'opacity-100' : 'opacity-0'}`}>
                            Clear
                        </button>
                    </form>

                    <div className="min-h-[40vh]">
                        {query === "" ? (
                             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Popular Categories</p>
                                <div className="flex flex-wrap gap-4">
                                    {["Lips", "Face", "Cheeks", "Best Sellers"].map((tag) => (
                                        <button key={tag} onClick={() => setQuery(tag)} className="px-6 py-2 rounded-full border border-stone-200 dark:border-stone-800 hover:border-[#AB462F] hover:text-[#AB462F] transition-colors text-sm font-bold uppercase tracking-wider">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                             </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {results.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-stone-50 dark:bg-white/5 p-3 rounded-lg" onClick={() => handleSearchResultClick(item)}>
                                            <div className="h-16 w-16 bg-white shrink-0 rounded overflow-hidden">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base uppercase">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">{item.category} — ₱{item.price}</p>
                                            </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 animate-in fade-in duration-200 md:hidden flex flex-col gap-8">
            <nav className="flex flex-col gap-6 text-2xl font-black uppercase tracking-tighter">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                <Link href="/best-sellers" onClick={() => setIsMobileMenuOpen(false)}>Best Sellers</Link>
                <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
                <Link href="#footer" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            </nav>
            <div className="h-px bg-border w-full" />
            
            {/* UPDATED MOBILE ACCOUNT SECTION */}
            <div className="flex flex-col gap-4">
                 <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Account</span>
                 
                 {isLoggedIn ? (
                    <div className="flex flex-col gap-3">
                        <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full rounded-full text-xs font-bold uppercase">My Dashboard</Button>
                        </Link>
                        <Button 
                            variant="default" 
                            className="w-full rounded-full text-xs font-bold uppercase bg-[#AB462F] hover:bg-[#944E45] text-white"
                            onClick={handleLogout}
                        >
                            Sign Out
                        </Button>
                    </div>
                 ) : (
                     <Link href="/account/login" onClick={() => setIsMobileMenuOpen(false)}>
                         <Button variant="outline" className="w-full rounded-full text-xs font-bold uppercase">Log In</Button>
                     </Link>
                 )}
            </div>
        </div>
      )}
    </>
  )
}