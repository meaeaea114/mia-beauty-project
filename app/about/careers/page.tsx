"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, X, Upload, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

const JOBS = [
  { title: "Social Media Manager", type: "Full-time", location: "Manila / Remote" },
  { title: "Product Developer", type: "Full-time", location: "Manila" },
  { title: "Customer Experience Lead", type: "Full-time", location: "Remote" },
  { title: "Graphic Designer", type: "Freelance", location: "Remote" },
]

export default function CareersPage() {
  const { toast } = useToast()
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApply = (position: string) => {
    setSelectedJob(position)
  }

  const handleClose = () => {
    setSelectedJob(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate network request
    setTimeout(() => {
        setIsSubmitting(false)
        setSelectedJob(null)
        toast({
            title: "Application Sent",
            description: `We've received your application for ${selectedJob}. Good luck!`,
            duration: 3000,
        })
    }, 2000)
  }

  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-20 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-6">
            Join the Team
          </h1>
          <p className="text-lg text-stone-500 font-light">
            We're always looking for passionate creative minds to help us redefine beauty standards.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6">Current Openings</h3>
          
          {JOBS.map((job, i) => (
            <div 
                key={i} 
                onClick={() => handleApply(job.title)}
                className="group flex items-center justify-between p-6 border border-stone-200 dark:border-stone-800 hover:border-[#AB462F] transition-colors bg-white dark:bg-white/5 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div>
                <h4 className="text-lg font-bold uppercase tracking-tight mb-1 group-hover:text-[#AB462F] transition-colors">{job.title}</h4>
                <div className="flex gap-4 text-xs text-stone-500 font-medium uppercase tracking-wider">
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5 text-stone-400 group-hover:text-[#AB462F]" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-stone-500 mb-4">Don't see your role?</p>
          <a href="mailto:careers@miabeauty.com" className="text-[#AB462F] font-bold uppercase tracking-widest text-xs border-b border-[#AB462F] pb-1 hover:text-[#944E45] hover:border-[#944E45] transition-colors">
            Email us your portfolio
          </a>
        </div>

      </div>

      {/* Application Form Modal - INCREASED Z-INDEX TO z-[100] */}
      <AnimatePresence>
        {selectedJob && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                />
                
                {/* Modal Container */}
                <motion.div 
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed left-0 right-0 top-0 bottom-0 md:top-10 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-[101] flex items-center justify-center pointer-events-none px-4 md:px-0"
                >
                    <div className="bg-[#FAF9F6] dark:bg-[#1a1a1a] w-full h-full md:h-auto md:max-h-full md:rounded-xl shadow-2xl overflow-y-auto pointer-events-auto flex flex-col border border-white/50 dark:border-white/10">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-[#FAF9F6]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm z-10">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#AB462F] mb-1">Applying For</p>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">{selectedJob}</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-stone-200 dark:hover:bg-white/10">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">First Name</label>
                                        <input required type="text" className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-none px-4 py-3 focus:outline-none focus:border-[#AB462F] transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Last Name</label>
                                        <input required type="text" className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-none px-4 py-3 focus:outline-none focus:border-[#AB462F] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Email Address</label>
                                    <input required type="email" className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-none px-4 py-3 focus:outline-none focus:border-[#AB462F] transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Portfolio / LinkedIn</label>
                                    <input type="url" className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-none px-4 py-3 focus:outline-none focus:border-[#AB462F] transition-colors" placeholder="https://" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Resume / CV</label>
                                    <div className="border border-dashed border-stone-300 dark:border-stone-700 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#AB462F] hover:bg-white dark:hover:bg-white/10 transition-all bg-white/50 dark:bg-white/5 group">
                                        <Upload className="h-6 w-6 text-stone-400 mb-3 group-hover:text-[#AB462F] transition-colors" />
                                        <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Upload your Resume</p>
                                        <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">PDF, DOCX up to 10MB</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Cover Letter (Optional)</label>
                                    <textarea rows={4} className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-stone-800 rounded-none px-4 py-3 focus:outline-none focus:border-[#AB462F] transition-colors resize-none" />
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full h-12 rounded-full bg-[#AB462F] hover:bg-[#944E45] text-white font-bold tracking-[0.15em] uppercase text-xs shadow-lg"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">Sending...</span>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </Button>
                                    <p className="text-center text-[10px] text-stone-400 mt-4 px-8">
                                        By clicking submit, you agree to our Terms of Service and Privacy Policy regarding your personal data.
                                    </p>
                                </div>
                            </form>
                        </div>

                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  )
}