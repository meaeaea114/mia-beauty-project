"use client"

import * as React from "react"
import { useEffect, useState, Suspense } from "react" // 1. Import Suspense
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

// --- FIREBASE IMPORTS ---
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

// 2. Create the inner component that handles all the logic
function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams() // This hook requires Suspense
  const { toast } = useToast()

  // 1. Existing Supabase Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (error) throw error

        if (data.user) {
            localStorage.setItem("mia-beauty-profile", JSON.stringify({
                email: data.user.email,
                id: data.user.id,
            }))
        }

        toast({
            title: "Welcome Back!",
            description: "Successfully logged in.",
            duration: 2000,
        })
        
        const redirectPath = searchParams.get('redirect') || "/account"
        router.push(redirectPath) 

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

  // 2. NEW Firebase Google SSO Handler
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      if (user) {
         // CRITICAL: Save to Local Storage so Checkout page works
         localStorage.setItem("mia-beauty-profile", JSON.stringify({
             email: user.email,
             id: user.uid, 
             firstName: user.displayName?.split(" ")[0] || "",
             lastName: user.displayName?.split(" ")[1] || ""
         }))
      }

      toast({
         title: "Welcome!",
         description: `Logged in as ${user.email}`,
         duration: 2000,
      })

      const redirectPath = searchParams.get('redirect') || "/account"
      router.push(redirectPath)

    } catch (error: any) {
      console.error("Google Login Error:", error)
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already logged in, redirect to dashboard
        router.replace("/account")
      }
    }
    checkUser()
  }, [])
  
  return (
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

          {/* --- GOOGLE SSO SECTION --- */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
                <div className="h-px bg-stone-200 dark:bg-stone-800 w-full absolute" />
                <span className="bg-white dark:bg-[#121212] px-3 text-[10px] uppercase tracking-widest text-stone-400 relative z-10 font-bold">Or Connect With</span>
            </div>

            <div className="w-full">
                <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-lg border-stone-200 dark:border-stone-800 hover:bg-stone-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-3 group" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    type="button"
                >
                    {/* Google SVG Logo */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26..81-.58z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-700">
                        Sign in with Google
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
  )
}

// 3. Export the wrapper component with the Suspense boundary
export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center pt-24 pb-12 px-4">
      <Suspense fallback={<div className="text-stone-500 text-sm">Loading Login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}