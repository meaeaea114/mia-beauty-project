"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
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

    setTimeout(() => {
      setIsLoading(false)
      if (fullCode.length === 6) {
        toast({
          title: "Email Verified",
          description: "Your account is now active.",
          duration: 2000,
        })
        router.push("/account/login")
      } else {
        toast({
          title: "Invalid Code",
          description: "Please enter the 6-digit code sent to your email.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 pt-32 pb-12">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-3 text-center">
            Check your email
          </h1>
          <p className="text-sm text-stone-500 mb-8 text-center max-w-xs leading-relaxed">
            We've sent a 6-digit verification code to your email address. Enter it below to activate your account.
          </p>

          <form onSubmit={handleVerify} className="w-full flex flex-col items-center gap-6">
             <div className="flex gap-2 justify-center w-full">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { if (el) inputRefs.current[idx] = el }} 
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-md focus:border-[#AB462F] focus:outline-none transition-colors"
                  />
                ))}
             </div>

             <Button 
               type="submit"
               disabled={isLoading}
               className="w-full h-14 rounded-full bg-[#E6D5C4] hover:bg-[#D6C0AB] text-[#4A403A] font-bold tracking-[0.15em] uppercase text-xs shadow-none transition-colors dark:bg-[#C6A87C] dark:text-black dark:hover:bg-[#B59665]"
             >
               {isLoading ? "Verifying..." : "Verify Code"}
             </Button>

             <button type="button" className="text-xs text-stone-400 uppercase tracking-widest hover:text-[#AB462F] transition-colors">
               Resend Code
             </button>
          </form>
        </div>
    </div>
  )
}