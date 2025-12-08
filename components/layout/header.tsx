"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { ShoppingBag, Moon, Sun, Menu, Search, User, X, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// --- COMPLETE SEARCH DATA INDEX (Synced with Shop Page) ---
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
  
  // Toggle States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Search Logic States
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(SEARCH_INDEX)

  const { toast } = useToast()
  const router = useRouter() // Init router

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

  // --- UPDATED NAVIGATION LOGIC ---
  const handleSearchResultClick = (item: typeof SEARCH_INDEX[0]) => {
    setIsSearchOpen(false)
    setQuery("") // Clear query
    
    toast({
      title: "Found it!",
      description: `Taking you to ${item.name}...`, 
      duration: 1000
    })

    // Navigate to Shop Page and scroll to Category Anchor
    // e.g., category "Lips" -> "/shop#lips"
    const sectionId = item.category.toLowerCase()
    router.push(`/shop#${sectionId}`)
  }

  if (!mounted) return null

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen || isCartOpen
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
            <Link 
              href="/" 
              className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/best-sellers" 
              className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors"
            >
              Best Seller
            </Link>
            <Link 
              href="#footer" 
              className="text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-[#C6A87C] transition-colors"
            >
              About
            </Link>
          </nav>

          {/* CENTER: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <a href="/" className="text-3xl font-serif font-bold tracking-tight text-[#C6A87C] hover:opacity-80 transition-opacity">
              MIA
            </a>
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-1 z-50">
            <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${isSearchOpen ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
                onClick={() => {
                   setIsSearchOpen(!isSearchOpen)
                   if(!isSearchOpen) setQuery("") 
                }}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* User Icon - Links to Login */}
            <Link href="/account/login">
              <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-black/5 dark:hover:bg-white/10 relative"
                onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#AB462F] rounded-full" />
            </Button>

            <div className="w-px h-4 bg-foreground/20 mx-2" />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
               <div className="relative h-5 w-5">
                  <Sun className={`absolute h-full w-full transition-all ${theme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'} text-amber-600`} />
                  <Moon className={`absolute h-full w-full transition-all ${theme === 'light' ? 'scale-0 -rotate-90' : 'scale-100 rotate-0'} text-foreground`} />
               </div>
               <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center gap-2 z-50">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                 <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
                  <ShoppingBag className="h-5 w-5" />
              </Button>
          </div>

        </div>
      </header>

      {/* --- SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl pt-32 px-4 md:px-8 overflow-y-auto"
            >
                <div className="container mx-auto max-w-4xl">
                    
                    {/* Search Input Area */}
                    <div className="relative border-b-2 border-stone-200 dark:border-stone-800 pb-2 mb-10">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search products, collections, or shades..." 
                            className="w-full bg-transparent border-none pl-12 pr-4 py-4 text-2xl md:text-4xl font-black uppercase tracking-tight placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 text-foreground"
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                         <button 
                            onClick={() => setQuery("")}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-[#AB462F] transition-opacity ${query ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                         >
                            Clear
                        </button>
                    </div>

                    {/* Search Results Area */}
                    <div className="min-h-[40vh]">
                        {query === "" ? (
                             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Popular Categories</p>
                                <div className="flex flex-wrap gap-4">
                                    {["Lips", "Face", "Cheeks", "Sets", "Best Sellers"].map((tag) => (
                                        <button 
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="px-6 py-2 rounded-full border border-stone-200 dark:border-stone-800 hover:border-[#AB462F] hover:text-[#AB462F] transition-colors text-sm font-bold uppercase tracking-wider"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                             </div>
                        ) : results.length > 0 ? (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                                    {results.length} Result{results.length !== 1 ? 's' : ''} found
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                                    {results.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="group cursor-pointer flex gap-4 items-center"
                                            onClick={() => handleSearchResultClick(item)}
                                        >
                                            <div className="h-20 w-16 bg-stone-100 dark:bg-white/5 shrink-0 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.category}</p>
                                                <h4 className="font-bold text-lg uppercase tracking-tight leading-none group-hover:text-[#AB462F] transition-colors">{item.name}</h4>
                                                <p className="text-sm font-medium mt-1">₱{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-60">
                                <p className="text-lg font-medium">No results found for "{query}"</p>
                                <p className="text-sm text-muted-foreground">Try checking for typos or using broader terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE MENU OVERLAY --- */}
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
            <div className="flex justify-between items-center">
                 <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Account</span>
                 <Link href="/account/login" onClick={() => setIsMobileMenuOpen(false)}>
                     <Button variant="outline" className="rounded-full text-xs font-bold uppercase">
                         Log In
                     </Button>
                 </Link>
            </div>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <>
            <div 
                className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsCartOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-background z-[70] shadow-2xl border-l animate-in slide-in-from-right duration-300 flex flex-col">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Your Bag (1)</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="h-24 w-20 bg-stone-100 dark:bg-white/5 shrink-0">
                            <img src="/images/fluffmatte-girlcrush.jpg" alt="Fluffmatte" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-sm uppercase">Fluffmatte</h3>
                                    <span className="text-sm font-medium">₱495</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Girl Crush</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex items-center border rounded-full px-2 py-0.5 gap-3">
                                    <button className="text-xs hover:text-[#AB462F]">-</button>
                                    <span className="text-xs font-medium">1</span>
                                    <button className="text-xs hover:text-[#AB462F]">+</button>
                                </div>
                                <button className="text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-secondary/20 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-bold">₱495</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">Shipping & taxes calculated at checkout.</p>
                    <Button className="w-full h-12 rounded-full font-bold uppercase tracking-widest bg-[#AB462F] hover:bg-[#944E45] text-white">
                        Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
      )}
    </>
  )
}