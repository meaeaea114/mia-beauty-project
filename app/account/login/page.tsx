"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mail, Eye, EyeOff, ArrowRight } from "lucide-react" 
import { supabase } from "@/lib/supabase" 

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  // --- 1. PHP/XAMPP CONNECTION LOGIC (UNCHANGED) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        // --- OLD PHP CODE (DELETE THIS) ---
        // const response = await fetch("http://localhost/mia-backend/login.php", ...)
        // ----------------------------------

        // --- NEW SUPABASE CODE (ADD THIS) ---
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (error) {
            throw error
        }

        // Login Success!
        // Supabase automatically handles the session (cookies/localStorage)
        
        toast({
            title: "Welcome Back!",
            description: "Successfully logged in.",
            duration: 2000,
        })
            
        router.push("/") // Redirect to home

    } catch (error: any) {
        console.error("Login Error:", error)
        toast({
            title: "Access Denied",
            description: error.message || "Invalid login credentials.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false)
    }
}

  // --- 2. UPDATED MAGIC LINK LOGIC ---
  const handleSSO = async (provider: string) => {
    
    // Check if email field is empty
    if (!formData.email) {
        return toast({
            title: "Email Required",
            description: "Please enter your email address above first.",
            variant: "destructive",
        })
    }

    if (provider === 'Email') {
      setIsLoading(true)

      try {
        // GET CURRENT ORIGIN
        // Ensure we capture the base URL (e.g., http://localhost:3000 or your-production-site.com)
        const origin = typeof window !== 'undefined' && window.location.origin 
            ? window.location.origin 
            : '';

        const { error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            // CRITICAL: The presence of this property tells Supabase to send a LINK, not a CODE.
            // When the user clicks the link, they will be redirected back to this URL.
            emailRedirectTo: `${origin}/`, 
          }
        })
        
        if (error) throw error

        toast({
          title: "Magic Link Sent!",
          description: `We sent a login link to ${formData.email}. Check your inbox!`,
          duration: 5000,
        })

      } catch (error: any) {
        console.error("Magic Link Error:", error)
        toast({
          title: "Unable to send link",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-[420px] bg-white dark:bg-white/5 border border-stone-100 dark:border-stone-800 shadow-2xl rounded-2xl p-8 md:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#AB462F] to-[#E6D5C4]" />

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2 text-stone-900 dark:text-white">
               Welcome Back
            </h1>
            <p className="text-sm text-stone-500">
              Sign in to manage your orders and beauty profile.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-stone-800 focus:border-[#AB462F] rounded-lg px-4 py-3 text-sm transition-all outline-none"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
             </div>
             
             <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Password</label>
                    <Link href="/account/recover" className="text-[10px] text-[#AB462F] hover:underline font-medium">Forgot?</Link>
                </div>
                <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-stone-50 dark:bg-black/20 border border-stone-200 dark:border-stone-800 focus:border-[#AB462F] rounded-lg px-4 py-3 text-sm transition-all outline-none pr-10"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
             </div>

             <Button 
               type="submit"
               disabled={isLoading}
               className="w-full h-12 mt-2 rounded-full bg-[#AB462F] hover:bg-[#944E45] text-white font-bold tracking-widest uppercase text-xs shadow-lg hover:shadow-[#AB462F]/20 transition-all"
             >
               {isLoading ? "Authenticating..." : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>}
             </Button>
          </form>

          {/* --- MAGIC LINK SECTION --- */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
                <div className="h-px bg-stone-200 dark:bg-stone-800 w-full absolute" />
                <span className="bg-white dark:bg-[#121212] px-3 text-[10px] uppercase tracking-widest text-stone-400 relative z-10 font-bold">Or Connect With</span>
            </div>

            <div className="w-full">
                <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-lg border-stone-200 dark:border-stone-800 hover:bg-stone-50 hover:border-[#AB462F]/30 hover:text-[#AB462F] transition-all flex items-center justify-center gap-3 group" 
                    onClick={() => handleSSO('Email')}
                    disabled={isLoading}
                >
                    <Mail className="w-4 h-4 text-stone-500 group-hover:text-[#AB462F] transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-[#AB462F] transition-colors">
                        Sign in with Magic Link
                    </span>
                </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-stone-500">
              Don't have an account?{" "}
              <Link href="/account/register" className="text-[#AB462F] font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>

        </div>
    </div>
  )
}