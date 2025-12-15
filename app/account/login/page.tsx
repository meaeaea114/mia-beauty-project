"use client"

import * as React from "react"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

// --- FIREBASE IMPORTS ---
import { onAuthStateChanged, signInWithPopup, getAdditionalUserInfo, deleteUser } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
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
        localStorage.setItem("mia-profile", JSON.stringify({
          email: data.user.email,
          id: data.user.id,
        }))
      }

        toast({
            title: "Welcome Back!",
            description: "Successfully logged in.",
            duration: 2000,
        })
        
        // Dispatch event to update header immediately
        window.dispatchEvent(new Event("storage"))
        
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

  // 2. Firebase Google SSO Handler (RESTRICTED TO EXISTING USERS)
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const details = getAdditionalUserInfo(result)

      // CHECK: If this is a new user trying to "Login", block them.
      if (details?.isNewUser) {
          // Immediately delete the new user created by the popup to rollback
          await deleteUser(user)
          
          toast({
              title: "Account Not Found",
              description: "Please create an account on the Register page first.",
              variant: "destructive",
              duration: 4000
          })
          setIsLoading(false)
          return
      }

      if (user) {
         localStorage.setItem("mia-profile", JSON.stringify({
           email: user.email,
           id: user.uid, 
           firstName: user.displayName?.split(" ")[0] || "",
           lastName: user.displayName?.split(" ")[1] || ""
         }))
      }

      toast({
         title: "Welcome Back!",
         description: `Logged in as ${user.email}`,
         duration: 2000,
      })

      // Dispatch event to update header immediately
      window.dispatchEvent(new Event("storage"))

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

  // Effect to redirect if already logged in (persistence check)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If they are already signed in from a previous session, just redirect
        router.replace("/account")
      }
    })
    return () => unsubscribe()
  }, [])
  
  return (
    <div className="w-full max-w-[440px] relative">
          
          {/* Main Glass Card */}
          <div className="bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            
            {/* Decorative Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#AB462F] to-transparent opacity-80" />

            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-[#1a1a1a] dark:text-white">
                    Welcome <span className="font-serif italic font-normal text-[#AB462F] lowercase tracking-normal">back</span>
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Please enter your details to sign in.
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                    <input 
                        type="email" 
                        className="w-full bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-stone-700 focus:border-[#AB462F] rounded-xl px-4 py-3 text-sm transition-all outline-none"
                        placeholder="name@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Password</label>
                        <Link href="/account/recover" className="text-[10px] text-[#AB462F] hover:underline font-bold tracking-wide">Forgot?</Link>
                    </div>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-stone-700 focus:border-[#AB462F] rounded-xl px-4 py-3 text-sm transition-all outline-none pr-10"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 mt-4 rounded-full bg-[#1a1a1a] hover:bg-[#AB462F] text-white font-bold tracking-[0.2em] uppercase text-xs shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</span>
                    ) : (
                        <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
                    )}
                </Button>
            </form>

            {/* --- DIVIDER --- */}
            <div className="relative flex items-center justify-center my-8">
                <div className="h-px bg-stone-200 dark:bg-white/10 w-full absolute" />
                <span className="bg-white/80 dark:bg-black/80 backdrop-blur px-3 text-[10px] uppercase tracking-widest text-stone-400 relative z-10 font-bold">Or</span>
            </div>

            {/* --- GOOGLE SSO (LOGIN ONLY) --- */}
            <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-3 group bg-white/50 dark:bg-transparent" 
                onClick={handleGoogleLogin}
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
                    Continue with Google
                </span>
            </Button>

            <div className="mt-8 text-center">
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Don't have an account?{" "}
                  <Link href="/account/register" className="font-bold text-[#AB462F] hover:underline transition-all">
                    Register now
                  </Link>
                </p>
            </div>

          </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center pt-28 pb-20 px-4 font-sans">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#AB462F]" />
        </div>
      }>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex justify-center"
        >
            <LoginForm />
        </motion.div>
      </Suspense>
    </div>
  )
}