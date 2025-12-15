// chatbot.tsx
"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageCircle, X, Send, ShoppingBag, 
  Sparkles, Truck, User, 
  RefreshCcw, Globe, AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/cart-context"
import { useRouter } from "next/navigation"

// --- 1. Enhanced Knowledge Base (Data) ---
type ProductData = {
  id: string
  name: string
  price: number
  image: string
  category: string
  tags: string[]
  concern: string[]
  ingredients: string[] // For irritation warnings
  description: string
}

const PRODUCT_KNOWLEDGE: ProductData[] = [
  { 
    id: "l1", name: "Fluffmatte", price: 399, image: "/images/Rectangle 131.png", 
    category: "lips", tags: ["matte", "lipstick"], concern: ["pale", "dry lips"], 
    ingredients: ["dimethicone", "pigment"], description: "Weightless modern matte lipstick." 
  },
  { 
    id: "f1", name: "Tinted Moisturizer", price: 430, image: "/images/Rectangle 147.png", 
    category: "face", tags: ["foundation", "base", "spf"], concern: ["dullness", "uv protection"], 
    ingredients: ["niacinamide", "spf"], description: "Oil-free base with SPF 20." 
  },
  { 
    id: "c1", name: "Airblush", price: 359, image: "/images/Rectangle 150.png", 
    category: "cheeks", tags: ["blush", "tint"], concern: ["pale"], 
    ingredients: ["vitamin e"], description: "Soft-focus sheer cheek tint." 
  },
  { 
    id: "f4", name: "Sun Safe", price: 350, image: "/images/Rectangle 145-3.png", 
    category: "face", tags: ["sunscreen", "serum"], concern: ["sun damage", "aging"], 
    ingredients: ["peptides", "ceramides"], description: "Invisible SPF 50+ serum." 
  },
  // Bundle Logic (Virtual Products)
  {
    id: "b_bridal", name: "Bridal Glow Kit", price: 1100, image: "/images/Rectangle 144-1.png",
    category: "bundle", tags: ["wedding", "set"], concern: ["long wear"],
    ingredients: [], description: "Full face set: Fluffmatte + Airblush + Base Booster."
  }
]

// --- 2. Language Dictionary (FIXED EMOJIS) ---
const STRINGS = {
  en: {
    welcome: "Hi! I'm Mia, your beauty assistant. ✨",
    welcome_back: "Welcome back, {name}! Need a refill on your favorites? 💖",
    help_prompt: "How can I help you today?",
    opt_shade: "Find my Shade 💄",
    opt_track: "Track Order 📦",
    opt_skin: "Skin Consultation 🧴",
    // REMOVED: opt_agent: "Talk to Human 👩‍💻",
    quiz_skin: "Let's find your match! What is your skin type?",
    quiz_concern: "What is your main skin concern?",
    rec_header: "Based on your profile, I recommend:",
    warn_irritation: "⚠️ Note: You mentioned sensitive skin. This product contains actives.",
    track_prompt: "Please enter your Order ID (e.g., #MIA123).",
    track_success: "Order {id} is OUT FOR DELIVERY 🚚. Arriving by 5 PM.",
    agent_connect: "Connecting you to a specialist...",
    agent_active: "You are now chatting with Sarah (Beauty Advisor).",
    lang_toggle: "Switch to Filipino",
    promo_alert: "⚡ FLASH SALE: Use code MIA20 for 20% off!",
    return_check: "I can help with returns. Is the item opened?",
  },
  fil: {
    welcome: "Hello! Ako si Mia, ang iyong beauty assistant. ✨",
    welcome_back: "Welcome back, {name}! Kailangan mo ba ng refill? 💖",
    help_prompt: "Paano ako makakatulong ngayon?",
    opt_shade: "Hanapin ang Shade ko 💄",
    opt_track: "Status ng Order 📦",
    opt_skin: "Skin Consultation 🧴",
    // REMOVED: opt_agent: "Makausap ang Tao 👩‍💻",
    quiz_skin: "Hanapin natin ang perfect match mo! Ano ang skin type mo?",
    quiz_concern: "Ano ang main concern mo sa balat?",
    rec_header: "Base sa profile mo, ito ang bagay sayo:",
    warn_irritation: "⚠️ Paalala: Sabi mo sensitive ang skin mo. May actives ito.",
    track_prompt: "Pakilagay ang Order ID (hal. #MIA123).",
    track_success: "Ang Order {id} ay OUT FOR DELIVERY na 🚚. Darating mamayang 5 PM.",
    agent_connect: "Kinokonekta ka sa specialist...",
    agent_active: "Ka-chat mo na si Sarah (Beauty Advisor).",
    lang_toggle: "Switch to English",
    promo_alert: "⚡ FLASH SALE: Gamitin ang code MIA20 para sa 20% off!",
    return_check: "Matutulungan kita sa returns. Nabuksan na ba ang item?",
  }
}

type Message = {
  id: string
  role: 'bot' | 'user' | 'agent'
  text: string
  type?: 'text' | 'product-list' | 'options' | 'video' | 'tracking'
  products?: ProductData[]
  options?: { label: string; action: string }[]
  videoSrc?: string
}

type UserProfile = {
  skinType?: 'oily' | 'dry' | 'sensitive' | 'combination' | 'normal'
  concern?: string
  name?: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [language, setLanguage] = useState<'en' | 'fil'>('en')
  
  // State Machine - REMOVED 'live_agent'
  const [mode, setMode] = useState<'idle' | 'quiz' | 'tracking' | 'return'>('idle')
  const [userProfile, setUserProfile] = useState<UserProfile>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // --- FIX: Destructure isCartOpen to detect when cart is active ---
  const { addItem, isCartOpen } = useCart()
  
  const router = useRouter()
  const t = STRINGS[language]

  // --- 3. Persistence & Init ---
  useEffect(() => {
    // Load profile
    const saved = localStorage.getItem('mia-profile')
    if (saved) setUserProfile(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (userProfile.skinType) localStorage.setItem('mia-profile', JSON.stringify(userProfile))
  }, [userProfile])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = userProfile.name 
        ? t.welcome_back.replace('{name}', userProfile.name) 
        : t.welcome
      
      addBotMessage(greeting)
      
      // Promo Trigger (Marketing Automation)
      setTimeout(() => {
        setMessages(prev => [...prev, { id: "promo", role: 'bot', text: t.promo_alert, type: 'text' }])
      }, 2500)

      setTimeout(() => showMainMenu(), 1000)
    }
  }, [isOpen, language])

  // --- Auto Scroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // --- Helpers ---
  const addBotMessage = (text: string, delay = 500) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text, type: 'text' }])
      setIsTyping(false)
    }, delay)
  }

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text }])
  }

  const showMainMenu = () => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), role: 'bot', text: t.help_prompt, type: 'options', 
        options: [
          { label: t.opt_skin, action: "start_quiz" },
          { label: t.opt_shade, action: "find_shade" },
          { label: t.opt_track, action: "track_order" },
          { label: "Return/Refund", action: "start_return" },
          // REMOVED: { label: t.opt_agent, action: "handoff_agent" },
        ]
      }])
      setIsTyping(false)
    }, 800)
  }

  // --- 4. Logic Engine ---
  const handleAction = (action: string, label?: string) => {
    if (label) addUserMessage(label)

    switch (action) {
      // --- Multilingual ---
      case 'toggle_lang':
        setLanguage(prev => prev === 'en' ? 'fil' : 'en')
        // Clean restart for demo purposes
        setMessages([]) 
        setIsOpen(false)
        setTimeout(() => setIsOpen(true), 100)
        break

      // --- Beauty Consultation (Quiz) ---
      case 'start_quiz':
        setMode('quiz')
        addBotMessage(t.quiz_skin)
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(), role: 'bot', text: "", type: 'options',
            options: [
              { label: "Oily 💧", action: "skin_oily" },
              { label: "Dry 🌵", action: "skin_dry" },
              { label: "Sensitive ☁️", action: "skin_sensitive" },
              { label: "Combination ⚖️", action: "skin_combo" }
            ]
          }])
        }, 1000)
        break

      case 'skin_oily': case 'skin_dry': case 'skin_sensitive': case 'skin_combo':
        const type = action.split('_')[1] as any
        setUserProfile(prev => ({ ...prev, skinType: type }))
        addBotMessage(t.quiz_concern)
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(), role: 'bot', text: "", type: 'options',
            options: [
              { label: "Acne/Blemishes", action: "concern_acne" },
              { label: "Aging/Lines", action: "concern_aging" },
              { label: "Dullness", action: "concern_dull" },
              { label: "Sun Protection", action: "concern_sun" }
            ]
          }])
        }, 1000)
        break

      case 'concern_acne': case 'concern_aging': case 'concern_dull': case 'concern_sun':
        finishQuiz(action)
        break

      // --- Order & Tracking ---
      case 'track_order':
        setMode('tracking')
        addBotMessage(t.track_prompt)
        break

      // --- Returns & Refunds ---
      case 'start_return':
        setMode('return')
        addBotMessage(t.return_check)
        setTimeout(() => {
           setMessages(prev => [...prev, {
             id: Date.now().toString(), role: 'bot', text: "", type: 'options',
             options: [
               { label: "Yes, opened", action: "return_opened" },
               { label: "No, sealed", action: "return_sealed" }
             ]
           }])
        }, 1000)
        break
      
      case 'return_opened':
        addBotMessage("For hygiene reasons, we cannot accept opened items unless defective. Is the item defective?")
        break
      
      case 'return_sealed':
        addBotMessage("Great! You are eligible for a full refund or shade exchange. Please enter your Order ID to proceed.")
        break

      // --- Human Handoff (REMOVED BLOCK) ---
      // case 'handoff_agent':
      //   setMode('live_agent')
      //   addBotMessage(t.agent_connect)
      //   setTimeout(() => {
      //     setMessages(prev => [...prev, { id: "agent_joined", role: 'bot', text: "👩‍💼 " + t.agent_active, type: 'text' }])
      //   }, 3000)
      //   break

      // --- Tutorial ---
      case 'show_tutorial':
        addBotMessage("Here's a quick guide for that glow:")
        setTimeout(() => {
          setMessages(prev => [...prev, { 
             id: Date.now().toString(), role: 'bot', text: "", type: 'video', 
             videoSrc: "/vid/Makeup_Tutorial_Video_Creation.mp4" 
          }])
        }, 1000)
        break

      default:
        showMainMenu()
    }
  }

  const finishQuiz = (concernAction: string) => {
    const concern = concernAction.split('_')[1]
    setUserProfile(prev => ({ ...prev, concern }))
    setMode('idle')
    
    addBotMessage(t.rec_header)
    
    // Smart Product Filter Logic
    let recs = PRODUCT_KNOWLEDGE.filter(p => {
       // Simple matching logic
       if (concern === 'sun' && p.category === 'face') return true
       if (concern === 'dull' && (p.category === 'cheeks' || p.category === 'lips')) return true
       if (concern === 'aging' && p.ingredients.includes('peptides')) return true
       return false
    })

    // Fallback if no specific match
    if (recs.length === 0) recs = [PRODUCT_KNOWLEDGE[0], PRODUCT_KNOWLEDGE[1]]

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'bot', text: "", type: 'product-list', products: recs
      }])
      
      // Irritation Warning Feature
      if (userProfile.skinType === 'sensitive') {
         addBotMessage(t.warn_irritation, 500)
      }
      
      // Upsell Bundle
      addOptionsMessage("Want to see a full look bundle?", [
        { label: "Show Bundles", action: "show_bundles" },
        { label: "No thanks", action: "menu" }
      ])
    }, 1500)
  }

  const addOptionsMessage = (text: string, options: { label: string; action: string }[]) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text, type: 'options', options }])
  }

  // --- 5. NLP Input Handler ---
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    const lower = inputValue.toLowerCase()
    setInputValue("")

    // REMOVED: if (mode === 'live_agent') block

    if (mode === 'tracking' || /#?MIA\d+/.test(inputValue.toUpperCase())) {
      const id = inputValue.toUpperCase().match(/#?MIA\d+/)?.[0] || "#MIA999"
      addBotMessage(t.track_success.replace('{id}', id))
      setMode('idle')
      return
    }

    // Keyword Detection - MODIFIED to remove 'human' and 'agent' detection and the call to handoff_agent
    if (lower.includes('tutorial') || lower.includes('how to')) {
      handleAction('show_tutorial')
      return
    }
    
    // Fallback response for previously handled keywords
    if (lower.includes('human') || lower.includes('agent') || lower.includes('support')) {
        addBotMessage("I'm sorry, I cannot connect you to a human agent at this time. How else can I help?")
        return
    }


    if (lower.includes('bundle') || lower.includes('set')) {
       const bundles = PRODUCT_KNOWLEDGE.filter(p => p.category === 'bundle')
       addBotMessage("Check out our best-value bundles:")
       setTimeout(() => {
         setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: "", type: 'product-list', products: bundles }])
       }, 1000)
       return
    }

    // Search
    const hits = PRODUCT_KNOWLEDGE.filter(p => 
       p.name.toLowerCase().includes(lower) || 
       p.tags.some(t => lower.includes(t)) ||
       p.category.includes(lower)
    )

    if (hits.length > 0) {
      addBotMessage(`Found ${hits.length} items:`)
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: "", type: 'product-list', products: hits }])
      }, 500)
    } else {
      addBotMessage("I didn't find that product. Try 'lipstick', 'sunscreen', or 'track order'.")
    }
  }

  return (
    // FIX: Wrapper div that hides chatbot when cart is open (preserving history)
    <div className={isCartOpen ? "hidden" : "contents"}>
      {/* Launcher */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full bg-[#AB462F] text-white shadow-xl flex items-center justify-center hover:bg-[#944E45] transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
        {/* Notification Dot */}
        {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>}
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 md:right-6 w-[360px] md:w-[400px] h-[600px] max-h-[80vh] bg-[#FDFCFA] dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col z-[60] overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-[#AB462F] p-4 flex items-center justify-between text-white shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm relative">
                   {/* mode is now 'idle', 'quiz', 'tracking', or 'return'. Only 'idle' is the standard bot. */}
                   {mode === 'idle' ? <Sparkles className="h-5 w-5" /> : <User className="h-5 w-5" />} 
                   <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border border-[#AB462F] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider">{mode === 'idle' ? 'Mia Assistant' : 'Mia Assistant'}</h3>
                  <div className="flex items-center gap-1 opacity-90">
                    <span className="text-[10px] font-medium opacity-80">Automated</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded-full" onClick={() => handleAction('toggle_lang')}>
                    <Globe className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded-full" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50 dark:bg-black/20 scroll-smooth">
               {messages.map((msg) => (
                 <motion.div 
                   key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                   className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                 >
                   {/* Removed agent icon condition */}
                   
                   <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                       msg.role === 'user' 
                         ? 'bg-[#AB462F] text-white rounded-br-none' 
                         // Agent style is no longer applicable, consolidating to bot style
                         : 'bg-white dark:bg-white/10 text-stone-800 dark:text-stone-200 rounded-bl-none border border-stone-100 dark:border-stone-800'
                     }`}>
                     {/* Alert / Warning Icon */}
                     {msg.text.includes("⚠️") && <AlertCircle className="inline w-4 h-4 mr-1 text-orange-500" />}
                     
                     <p>{msg.text}</p>

                     {/* Video */}
                     {msg.type === 'video' && msg.videoSrc && (
                       <div className="mt-3 rounded-lg overflow-hidden relative bg-black aspect-video group cursor-pointer shadow-lg">
                          <video src={msg.videoSrc} className="w-full h-full object-cover" controls autoPlay muted loop />
                       </div>
                     )}

                     {/* Products */}
                     {msg.type === 'product-list' && msg.products && (
                       <div className="mt-3 space-y-2">
                         {msg.products.map(product => (
                           <div key={product.id} className="flex gap-3 bg-stone-50 dark:bg-white/5 p-2 rounded-lg border border-stone-100 dark:border-stone-700 items-center hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
                              <div className="w-12 h-12 bg-white rounded-md flex-shrink-0 overflow-hidden border border-stone-200">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs truncate dark:text-white uppercase tracking-tight">{product.name}</p>
                                <p className="text-[10px] text-stone-500">₱{product.price}</p>
                              </div>
                              <Button size="sm" className="h-7 w-7 rounded-full p-0 bg-[#AB462F] hover:bg-[#944E45]"
                                onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                              >
                                <ShoppingBag className="h-3 w-3 text-white" />
                              </Button>
                           </div>
                         ))}
                       </div>
                     )}

                     {/* Options */}
                     {msg.type === 'options' && msg.options && (
                       <div className="flex flex-wrap gap-2 mt-3">
                         {msg.options.map((opt, idx) => (
                           <button key={idx} onClick={() => handleAction(opt.action, opt.label)}
                             className="text-xs bg-stone-100 dark:bg-white/10 hover:bg-[#AB462F] hover:text-white dark:hover:bg-[#AB462F] text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 transition-all shadow-sm font-medium"
                           >
                             {opt.label}
                           </button>
                         ))}
                       </div>
                     )}
                   </div>
                 </motion.div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                   <div className="bg-white dark:bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 border border-stone-100 dark:border-stone-800">
                     <div className="flex gap-1">
                       <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                     </div>
                   </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleInputSubmit} className="p-3 bg-white dark:bg-[#1a1a1a] border-t border-stone-200 dark:border-stone-800 flex gap-2 shrink-0">
               <input 
                 type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                 // Placeholder simplified as live_agent mode no longer exists
                 placeholder={t.help_prompt}
                 className="flex-1 bg-stone-100 dark:bg-white/5 border-transparent focus:border-[#AB462F] focus:ring-0 rounded-full px-4 py-2 text-sm outline-none transition-all placeholder:text-stone-400"
               />
               <Button type="submit" size="icon" disabled={!inputValue.trim()} className="rounded-full bg-[#AB462F] hover:bg-[#944E45] w-10 h-10 shrink-0">
                 <Send className="h-4 w-4 text-white" />
               </Button>
            </form>

            {/* Feature Footer */}
            <div className="px-4 py-2 bg-stone-50 dark:bg-black/40 text-[9px] text-stone-400 flex justify-between items-center border-t border-stone-100 dark:border-stone-800">
                <span className="flex items-center gap-1"><User className="w-3 h-3"/> {userProfile.skinType ? `${userProfile.skinType} Skin Profile` : 'Guest'}</span>
                <div className="flex gap-3">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-[#AB462F]"><Truck className="w-3 h-3" /> Track</span>
                    <span className="flex items-center gap-1 cursor-pointer hover:text-[#AB462F]"><RefreshCcw className="w-3 h-3" /> Returns</span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}