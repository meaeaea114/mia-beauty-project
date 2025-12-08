"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Chrome, Apple, Facebook, Twitter, Github, Linkedin, Instagram, Gitlab, Twitch } from "lucide-react"

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

  const handleSSO = async (provider: string) => {
    setIsLoading(true)
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider.toLowerCase() as any, // e.g., 'google', 'apple'
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        })
        if (error) throw error
    } catch (error: any) {
        toast({
            title: "SSO Error",
            description: error.message,
            variant: "destructive"
        })
        setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 pt-32 pb-12">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4 text-center">
            Create Account
          </h1>
          <p className="text-[15px] text-stone-500 mb-10 text-center leading-relaxed">
            Already have an account?{" "}
            <Link href="/account/login" className="underline underline-offset-4 decoration-stone-300 hover:text-[#AB462F] transition-colors">
              Log in here.
            </Link>
          </p>

          <form className="w-full space-y-6" onSubmit={handleRegister}>
             <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full bg-white dark:bg-white/5 border-transparent focus:border-[#AB462F] rounded-md px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-0 transition-all"
                  required
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full bg-white dark:bg-white/5 border-transparent focus:border-[#AB462F] rounded-md px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-0 transition-all"
                  required
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
             </div>
             
             <input 
               type="email" 
               placeholder="Email" 
               className="w-full bg-white dark:bg-white/5 border-transparent focus:border-[#AB462F] rounded-md px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-0 transition-all"
               required
               onChange={(e) => setFormData({...formData, email: e.target.value})}
             />
             
             <input 
               type="password" 
               placeholder="Password" 
               className="w-full bg-white dark:bg-white/5 border-transparent focus:border-[#AB462F] rounded-md px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-0 transition-all"
               required
               onChange={(e) => setFormData({...formData, password: e.target.value})}
             />

             <Button 
               type="submit"
               disabled={isLoading}
               className="w-full h-14 mt-4 rounded-full bg-[#E6D5C4] hover:bg-[#D6C0AB] text-[#4A403A] font-bold tracking-[0.15em] uppercase text-xs shadow-none transition-colors dark:bg-[#C6A87C] dark:text-black dark:hover:bg-[#B59665]"
             >
               {isLoading ? "Creating..." : "Create Account"}
             </Button>
          </form>

          {/* Spacer & Divider */}
          <div className="w-full mt-12 mb-8">
            <div className="relative flex items-center justify-center mb-8">
                <div className="h-px bg-stone-200 dark:bg-stone-800 w-full absolute" />
                <span className="bg-[#FDFCFA] dark:bg-[#1a1a1a] px-4 text-[10px] uppercase tracking-widest text-stone-400 relative z-10">Or Sign Up With</span>
            </div>

            {/* Logo-only SSO Buttons */}
            <div className="flex justify-center gap-3 flex-wrap max-w-[400px] mx-auto">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('Google')}>
                    <Chrome className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('Apple')}>
                    <Apple className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('Facebook')}>
                    <Facebook className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('Twitter')}>
                    <Twitter className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('GitHub')}>
                    <Github className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('LinkedIn')}>
                    <Linkedin className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('Instagram')}>
                    <Instagram className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('GitLab')}>
                    <Gitlab className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-white/5 hover:bg-stone-50 dark:hover:bg-stone-800 hover:scale-110 transition-all duration-300 shadow-sm" onClick={() => handleSSO('Twitch')}>
                    <Twitch className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </Button>
            </div>
          </div>

        </div>
    </div>
  )
}