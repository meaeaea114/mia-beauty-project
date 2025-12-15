"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"

// --- FIREBASE IMPORTS ---
import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // 1. Supabase Email/Password Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      })

      if (error) throw error

      localStorage.setItem("pending_verification_email", formData.email)

      toast({
        title: "Account Created",
        description: "Please check your email for the verification code.",
        duration: 2000,
      })
      
      router.push("/account/verify") 
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Firebase Google Sign-Up Handler (ALLOWS NEW USERS)
  const handleGoogleRegister = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const details = getAdditionalUserInfo(result)

      if (user) {
         localStorage.setItem("mia-profile", JSON.stringify({
           email: user.email,
           id: user.uid, 
           firstName: user.displayName?.split(" ")[0] || "",
           lastName: user.displayName?.split(" ")[1] || ""
         }))
      }

      // Dispatch event to update header immediately
      window.dispatchEvent(new Event("storage"))

      toast({
         title: details?.isNewUser ? "Welcome to MIA!" : "Welcome Back!",
         description: "Account successfully verified with Google.",
         duration: 2000,
      })

      router.push("/account")

    } catch (error: any) {
      console.error("Google Register Error:", error)
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center pt-28 pb-20 px-4 md:px-8 font-sans">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 overflow-hidden"
        >
            
            {/* --- LEFT COLUMN: Editorial Image/Vibe --- */}
            <div className="hidden lg:flex flex-col relative rounded-[40px] overflow-hidden min-h-[600px] bg-[#EFECE5] dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-lg">
                <img 
                    src="/images/shop-look-portrait.jpg" 
                    alt="Join MIA" 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="relative z-10 mt-auto p-12 text-white">
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-[#AB462F]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">MIA Rewards</span>
                    </div>
                    <h2 className="text-4xl font-serif italic mb-2">Join the collective.</h2>
                    <p className="text-sm font-light text-white/80 leading-relaxed max-w-xs">
                        Unlock early access to drops, exclusive member-only offers, and beauty rewards tailored just for you.
                    </p>
                </div>
            </div>

            {/* --- RIGHT COLUMN: Form --- */}
            <div className="flex flex-col justify-center p-6 md:p-12 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[40px] shadow-2xl">
                
                <div className="mb-8 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-[#1a1a1a] dark:text-white">
                        Create <br/> <span className="font-serif italic font-normal text-[#AB462F] lowercase tracking-normal">account</span>
                    </h1>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        Already have an account?{" "}
                        <Link href="/account/login" className="font-bold text-[#AB462F] hover:underline underline-offset-4 decoration-[#AB462F]/30">
                            Log in here
                        </Link>
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleRegister}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">First Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-700 focus:border-[#AB462F] rounded-xl px-4 py-3 text-sm transition-all outline-none"
                                placeholder="Jane"
                                required
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Last Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-700 focus:border-[#AB462F] rounded-xl px-4 py-3 text-sm transition-all outline-none"
                                placeholder="Doe"
                                required
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-700 focus:border-[#AB462F] rounded-xl px-4 py-3 text-sm transition-all outline-none"
                            placeholder="name@example.com"
                            required
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-700 focus:border-[#AB462F] rounded-xl px-4 py-3 text-sm transition-all outline-none"
                            placeholder="••••••••"
                            required
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <p className="text-[10px] text-stone-400 text-right pr-1 pt-1">Must be at least 6 characters</p>
                    </div>

                    <div className="pt-2">
                        <Button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.2em] uppercase text-xs shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating...</span>
                            ) : (
                                <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
                            )}
                        </Button>
                    </div>
                </form>

                {/* --- DIVIDER --- */}
                <div className="relative flex items-center justify-center my-6">
                    <div className="h-px bg-stone-200 dark:bg-white/10 w-full absolute" />
                    <span className="bg-white/80 dark:bg-black/80 backdrop-blur px-3 text-[10px] uppercase tracking-widest text-stone-400 relative z-10 font-bold">Or</span>
                </div>

                {/* --- GOOGLE SSO (SIGN UP) --- */}
                <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-3 group bg-white/50 dark:bg-transparent" 
                    onClick={handleGoogleRegister}
                    disabled={isLoading}
                    type="button"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.04-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26..81-.58z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-700 dark:text-stone-300 dark:group-hover:text-white">
                        Sign up with Google
                    </span>
                </Button>
                
                <p className="text-[10px] text-center text-stone-400 leading-relaxed px-4 pt-4">
                    By creating an account, you agree to our <Link href="/legal/terms" className="underline hover:text-[#AB462F]">Terms of Service</Link> and <Link href="/legal/privacy" className="underline hover:text-[#AB462F]">Privacy Policy</Link>.
                </p>

            </div>
        </motion.div>
    </div>
  )
}