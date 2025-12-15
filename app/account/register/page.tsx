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

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Sign up with Supabase
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

      // 2. Temporarily save email for the Verify Page to use
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
                    src="/images/shop-look-portrait.jpg" // Using an existing image from your landing page
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
                
                <div className="mb-10 text-center lg:text-left">
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

                    <div className="pt-4">
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
                    
                    <p className="text-[10px] text-center text-stone-400 leading-relaxed px-4 pt-4">
                        By creating an account, you agree to our <Link href="/legal/terms" className="underline hover:text-[#AB462F]">Terms of Service</Link> and <Link href="/legal/privacy" className="underline hover:text-[#AB462F]">Privacy Policy</Link>.
                    </p>
                </form>

            </div>
        </motion.div>
    </div>
  )
}