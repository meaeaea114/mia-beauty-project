"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Chrome, Apple, Facebook, Twitter, Mail, Eye, EyeOff, ArrowRight } from "lucide-react" 
// ASSUMPTION: Supabase is imported here
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
    // ... (Original PHP/XAMPP logic remains here) ...

    try {
        // NOTE: Ensure your XAMPP Apache server is running.
        // Create a folder 'mia-backend' in htdocs and place 'login.php' there.
        const response = await fetch("http://localhost/mia-backend/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
        })

        const data = await response.json()

        if (data.success) {
            // Success: Save user to local storage for the Chatbot/Header to detect
            localStorage.setItem("mia-beauty-profile", JSON.stringify({
                name: data.user.name, 
                email: data.user.email,
                skinType: data.user.skin_type || "normal"
            }))

            toast({
                title: "Welcome Back!",
                description: `Successfully logged in as ${data.user.name}.`,
                duration: 2000,
            })
            
            // Redirect to Home
            router.push("/")
        } else {
            // PHP returned an error (e.g., "Invalid password")
            throw new Error(data.message || "Login failed")
        }

    } catch (error: any) {
        // Fallback for Demo/Classmate purpose if XAMPP isn't running yet
        // REMOVE THIS BLOCK if you want strict PHP-only dependency
        if (formData.email === "admin@example.com" && formData.password === "password") {
             localStorage.setItem("mia-beauty-profile", JSON.stringify({ name: "Admin User", email: "admin@example.com" }))
             toast({ title: "Demo Login Success", description: "Logged in via fallback mode.", duration: 2000 })
             router.push("/")
             return
        }

        console.error("Login Error:", error)
        toast({
            title: "Access Denied",
            description: error.message === "Failed to fetch" 
                ? "Cannot connect to Database. Is XAMPP running?" 
                : error.message,
            variant: "destructive",
        })
    } finally {
        setIsLoading(false)
    }
  }

// --- 2. UPDATED SSO/PASSWORDLESS LOGIC ---
  const handleSSO = async (provider: string) => {
    
    // A. Handle Magic Link Flow (Yes/No Verification)
    if (provider === 'Email') {
      if (!formData.email) {
        return toast({
          title: "Email Required",
          description: "Please enter your email in the field above to receive a login link.",
          variant: "destructive",
        })
      }
      setIsLoading(true)

      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            shouldCreateUser: false, 
            // Removed: channel: 'email' (to revert to magic link)
            emailRedirectTo: '/', // Redirect user to home page after clicking link
          }
        })
        
        if (error) throw error

        toast({
          title: "Confirmation Sent!",
          description: `Check your inbox at ${formData.email} and click the link to sign in.`,
          duration: 4000,
        })
        
        // NO REDIRECTION needed here, the user waits for the email.

      } catch (error: any) {
        toast({
          title: "Login Failed",
          description: error.message || "Could not send link. Account may not exist.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
      return
    }
    
    // B. Handle Standard OAuth (Google, Facebook, etc.)
    toast({
      title: `Connecting to ${provider}`,
      description: "Redirecting to secure authentication...",
      duration: 1500,
    })
    
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider.toLowerCase() as any,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        })
        if (error) throw error
    } catch (error: any) {
        toast({ title: "SSO Error", description: error.message, variant: "destructive" })
    }
  }

  return (
    // MODIFIED: Changed solid background to transparent
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-[420px] bg-white dark:bg-white/5 border border-stone-100 dark:border-stone-800 shadow-2xl rounded-2xl p-8 md:p-10 relative overflow-hidden">
          
          {/* Decorative Top Border */}
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

          {/* --- LIMITED SSO (TOP 5) --- */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
                <div className="h-px bg-stone-200 dark:bg-stone-800 w-full absolute" />
                <span className="bg-white dark:bg-[#121212] px-3 text-[10px] uppercase tracking-widest text-stone-400 relative z-10 font-bold">Or Connect With</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
                <Button variant="outline" size="icon" className="w-full h-10 rounded-lg border-stone-200 dark:border-stone-800 hover:bg-stone-50 hover:scale-105 transition-transform" onClick={() => handleSSO('Google')}>
                    <Chrome className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-full h-10 rounded-lg border-stone-200 dark:border-stone-800 hover:bg-stone-50 hover:scale-105 transition-transform" onClick={() => handleSSO('Apple')}>
                    <Apple className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-full h-10 rounded-lg border-stone-200 dark:border-stone-800 hover:bg-stone-50 hover:scale-105 transition-transform" onClick={() => handleSSO('Facebook')}>
                    <Facebook className="w-4 h-4 text-blue-600" />
                </Button>
                <Button variant="outline" size="icon" className="w-full h-10 rounded-lg border-stone-200 dark:border-stone-800 hover:bg-stone-50 hover:scale-105 transition-transform" onClick={() => handleSSO('Twitter')}>
                    <Twitter className="w-4 h-4 text-sky-500" />
                </Button>
                {/* Email/Magic Link Button */}
                <Button variant="outline" size="icon" className="w-full h-10 rounded-lg border-stone-200 dark:border-stone-800 hover:bg-stone-50 hover:scale-105 transition-transform" onClick={() => handleSSO('Email')}>
                    <Mail className="w-4 h-4" />
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