"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react"

export default function RecoverPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Recovery Link Sent",
        description: `We sent a reset link to ${email}`,
        duration: 3000,
      })
      setEmail("") // Clear field
      // Optional: Redirect back to login so they can sign in with new password later
      setTimeout(() => router.push("/account/login"), 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center pt-28 pb-20 px-4 md:px-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 overflow-hidden"
      >
        
        {/* --- LEFT COLUMN: Editorial Image --- */}
        <div className="hidden lg:flex flex-col relative rounded-[40px] overflow-hidden min-h-[600px] bg-[#EFECE5] dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-lg">
            <img 
                src="/images/Rectangle 80.png" // Using one of your existing texture/product images
                alt="Account Recovery" 
                className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
            
            <div className="relative z-10 mt-auto p-12 text-white">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
                    <Lock className="w-3 h-3 text-[#AB462F]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Access</span>
                </div>
                <h2 className="text-4xl font-serif italic mb-2">Don't worry.</h2>
                <p className="text-sm font-light text-white/80 leading-relaxed max-w-xs">
                    It happens to the best of us. We'll help you get back to your beauty essentials in no time.
                </p>
            </div>
        </div>

        {/* --- RIGHT COLUMN: Recovery Form --- */}
        <div className="flex flex-col justify-center p-8 md:p-16 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[40px] shadow-2xl">
            
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-[#1a1a1a] dark:text-white">
                    Recover <br/> <span className="font-serif italic font-normal text-[#AB462F] lowercase tracking-normal">Password</span>
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                    Enter the email address associated with your account and we'll send you a secure link to reset your password.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleRecover}>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                    <div className="relative">
                        <input 
                            type="email" 
                            className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-700 focus:border-[#AB462F] rounded-xl px-4 py-4 pl-12 text-sm transition-all outline-none"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                    </div>
                </div>

                <div className="pt-2">
                    <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.2em] uppercase text-xs shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending...</span>
                        ) : (
                            <span className="flex items-center gap-2">Send Reset Link <ArrowRight className="w-4 h-4" /></span>
                        )}
                    </Button>
                </div>
                
                <div className="text-center pt-4">
                    <Link 
                        href="/account/login" 
                        className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-[#AB462F] transition-colors border-b-2 border-transparent hover:border-[#AB462F] pb-0.5"
                    >
                        Back to Login
                    </Link>
                </div>
            </form>

        </div>
      </motion.div>
    </div>
  )
}