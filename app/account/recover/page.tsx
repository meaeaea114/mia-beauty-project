"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import { Chrome, Apple, Facebook, Twitter, Github, Linkedin, Instagram, Gitlab, Twitch } from "lucide-react"

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

  const handleSSO = (provider: string) => {
    setIsLoading(true)
    toast({
      title: `Connecting to ${provider}`,
      description: "Redirecting to provider authentication...",
      duration: 1500,
    })
    
    // Simulate redirect delay
    setTimeout(() => {
        setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground font-sans pt-32 pb-12">
      <Header />

      <main className="flex-grow flex items-center justify-center w-full px-4">
        {/* Increased max-width for better spacing */}
        <div className="w-full max-w-[480px] flex flex-col items-center">
          
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4 text-center">
            Recover Password
          </h1>
          <p className="text-[15px] text-stone-500 mb-10 text-center max-w-sm leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>

          <form className="w-full space-y-6" onSubmit={handleRecover}>
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="w-full bg-white dark:bg-white/5 border-transparent focus:border-[#AB462F] rounded-md px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-0 transition-all"
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               disabled={isLoading}
             />

             <Button 
               type="submit"
               disabled={isLoading}
               className="w-full h-14 rounded-full bg-[#E6D5C4] hover:bg-[#D6C0AB] text-[#4A403A] font-bold tracking-[0.15em] uppercase text-xs shadow-none transition-colors dark:bg-[#C6A87C] dark:text-black dark:hover:bg-[#B59665]"
             >
               {isLoading ? "Sending..." : "Send Reset Link"}
             </Button>
          </form>

          <div className="mt-4">
            <Link href="/account/login" className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-[#AB462F] transition-colors border-b border-transparent hover:border-[#AB462F] pb-0.5">
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}