"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Scale, 
  ShieldAlert, 
  Lock, 
  Copyright, 
  FileText, 
  AlertTriangle, 
  Globe 
} from "lucide-react"

const SECTIONS = [
  {
    title: "Introduction",
    icon: Scale,
    content: (
      <>
        Welcome to <strong>MIA</strong> ("we," "us," or "our"). These Terms of Service ("Terms") govern your use of our website located at <strong>www.miabeauty.com</strong> (the "Site") and the purchase of our products. By accessing or using our Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must discontinue use of the Site immediately.
      </>
    )
  },
  {
    title: "Account Security",
    icon: Lock,
    content: (
      <div className="bg-[#FAF9F6] dark:bg-white/5 p-6 rounded-2xl border border-stone-100 dark:border-white/5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">User Responsibilities</p>
        <ul className="space-y-3">
            {[
              "Maintain confidentiality of login credentials.",
              "Accept responsibility for all account activities.",
              "Notify us immediately of unauthorized use.",
              "We reserve the right to terminate accounts at our discretion."
            ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#AB462F] mt-2 shrink-0" />
                    {item}
                </li>
            ))}
        </ul>
      </div>
    )
  },
  {
    title: "Intellectual Property",
    icon: Copyright,
    content: (
      <>
        <p className="mb-4">
            All content on this Site—including text, graphics, logos, images, software, and product designs—is the exclusive property of <strong>MIA</strong> or its content suppliers and is protected by Philippine and international copyright, trademark, and intellectual property laws.
        </p>
        <p className="text-sm italic text-stone-500 border-l-2 border-[#AB462F] pl-4 py-1">
            You are granted a limited, non-exclusive license to access and use the Site for personal, non-commercial purposes only.
        </p>
      </>
    )
  },
  {
    title: "Prohibited Conduct",
    icon: ShieldAlert,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 transition-colors">
              <h4 className="font-bold text-red-800 dark:text-red-400 text-[10px] uppercase tracking-widest mb-2">Illegal Acts</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">Violating local, national, or international laws; engaging in fraud or impersonation.</p>
          </div>
          <div className="p-5 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 transition-colors">
              <h4 className="font-bold text-red-800 dark:text-red-400 text-[10px] uppercase tracking-widest mb-2">Malicious Tech</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">Interfering with security features, transmitting viruses, or using data mining robots.</p>
          </div>
      </div>
    )
  },
  {
    title: "User Content",
    icon: FileText,
    content: (
      <p>
        If you post reviews, comments, or other content ("User Content") on our Site or social media channels, you grant <strong>MIA</strong> a non-exclusive, royalty-free, perpetual, and irrevocable right to use, reproduce, modify, adapt, publish, and display such content throughout the world in any media.
      </p>
    )
  },
  {
    title: "Disclaimers",
    icon: AlertTriangle,
    content: (
      <p className="text-sm leading-loose">
          The Site and all products and services delivered to you are provided 'as is' and 'as available' for your use, without any representation, warranties, or conditions of any kind. We do not guarantee that the Site will be uninterrupted, secure, or error-free.
          <br/><br/>
          In no case shall <strong>MIA</strong> be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, or consequential damages arising from your use of the Site.
      </p>
    )
  },
  {
    title: "Governing Law",
    icon: Globe,
    content: (
      <p>
          These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes shall be subject to the exclusive jurisdiction of the courts located in <strong>Metro Manila, Philippines</strong>.
      </p>
    )
  }
]

export default function TermsPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      
      {/* --- Header Section --- */}
      <div className="container mx-auto px-6 md:px-12 max-w-4xl mb-24 text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md mb-8">
             <div className="w-1.5 h-1.5 rounded-full bg-[#AB462F] animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300">Legal Agreement</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 text-[#1a1a1a] dark:text-white leading-[0.85]">
            Terms of <br/> <span className="font-serif italic font-normal lowercase tracking-normal text-stone-400 dark:text-stone-500">service</span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 font-light max-w-lg mx-auto leading-relaxed">
            The rules of engagement. Please read these terms carefully before accessing or using our services.
          </p>
        </motion.div>
      </div>

      {/* --- Main Document Container --- */}
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <div className="relative">
            
            {/* Sticky "Last Updated" Badge */}
            <div className="hidden lg:block absolute -right-40 top-0 sticky top-32">
                <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#AB462F] mb-1">Effective Date</span>
                    <span className="text-xs font-medium text-stone-400">November 15, 2022</span>
                    <div className="h-8 w-px bg-stone-200 dark:bg-white/10 mt-4 mr-2" />
                </div>
            </div>

            <div className="space-y-12">
                {SECTIONS.map((section, index) => {
                    const Icon = section.icon
                    return (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-xs font-bold text-stone-300 font-mono">0{index + 1}</span>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] dark:text-white group-hover:text-[#AB462F] transition-colors flex items-center gap-3">
                                    {section.title}
                                </h3>
                            </div>
                            
                            <div className="pl-8 md:pl-10 border-l border-stone-200 dark:border-white/10 group-hover:border-[#AB462F]/30 transition-colors pb-8">
                                <div className="text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                                    {section.content}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* End Mark */}
            <div className="flex justify-center mt-20 opacity-30">
                <div className="w-16 h-1 bg-[#1a1a1a] dark:bg-white" />
            </div>

        </div>
      </div>
    </div>
  )
}