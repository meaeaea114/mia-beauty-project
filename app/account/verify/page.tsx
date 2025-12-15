"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase" 
import { motion } from "framer-motion"
import { Mail, ArrowRight, Loader2, Lock } from "lucide-react"

export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Retrieve email from storage when component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("pending_verification_email")
    if (storedEmail) {
        setEmail(storedEmail)
    } else {
        toast({ title: "Error", description: "No pending registration found.", variant: "destructive" })
        router.push("/account/register")
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const fullCode = code.join("")

    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: fullCode,
            type: 'signup'
        })

        if (error) throw error

        toast({
            title: "Email Verified",
            description: "Your account is now active.",
            duration: 2000,
        })
        
        // Clear temporary email
        localStorage.removeItem("pending_verification_email")
        
        // Redirect to login or straight to home if verifyOtp logs them in automatically (it usually does)
        router.push("/account/login")
        
    } catch (error: any) {
        toast({
            title: "Verification Failed",
            description: error.message || "Invalid code.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false)
    }
  }

  const resendCode = async () => {
    if(!email) return
    toast({ title: "Sending...", description: "Requesting new code." })
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
    })
    if(error) {
        toast({ title: "Error", description: error.message, variant: "destructive"})
    } else {
        toast({ title: "Code Resent", description: "Check your email inbox." })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 pt-32 pb-20 bg-transparent min-h-screen font-sans text-[#1a1a1a] dark:text-white">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[440px] p-8 md:p-12 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-[32px] flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#AB462F]/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-[#AB462F]" />
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-center">
            Verify <span className="font-serif italic font-normal text-[#AB462F] lowercase tracking-normal">Account</span>
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 text-center max-w-xs leading-relaxed">
            We've sent a 6-digit verification code to <strong>{email}</strong>.
          </p>

          <form onSubmit={handleVerify} className="w-full flex flex-col items-center gap-6">
             <div className="flex gap-3 justify-center w-full">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { if (el) inputRefs.current[idx] = el }} 
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-14 md:w-12 md:h-16 text-center text-2xl font-bold bg-white/50 dark:bg-black/20 border border-stone-300 dark:border-stone-700 rounded-xl focus:border-[#AB462F] focus:outline-none transition-colors caret-[#AB462F] text-[#1a1a1a] dark:text-white font-mono shadow-sm"
                  />
                ))}
             </div>

             <Button 
               type="submit"
               disabled={isLoading || code.join("").length < 6}
               className="w-full h-14 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.2em] uppercase text-xs shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mt-4"
             >
               {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</span>
                ) : (
                    <span className="flex items-center gap-2">Verify Code <ArrowRight className="w-4 h-4" /></span>
                )}
             </Button>

             <button type="button" onClick={resendCode} disabled={isLoading} className="text-xs text-stone-400 uppercase tracking-widest hover:text-[#AB462F] transition-colors mt-2">
               Resend Code
             </button>
          </form>
        </motion.div>
    </div>
  )
}