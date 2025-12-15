"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Lock, 
  Globe, 
  FileText, 
  ShieldAlert, 
  Info, 
  EyeOff, 
  Code 
} from "lucide-react"

const SECTIONS = [
  {
    title: "Introduction",
    icon: Info,
    content: (
      <>
        At <strong>MIA</strong> ("we," "us," or "our"), we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, maintain, and disclose information when you access or use our website, <strong>www.miabeauty.com</strong> (the "Site"), or interact with us via email, mobile applications, or other electronic means.
        <p className="mt-4">
          By using our Site, you consent to the data practices described in this policy. If you do not agree with these terms, please discontinue use of the Site.
        </p>
      </>
    )
  },
  {
    title: "Information We Collect",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <p className="mb-4">
          We collect information to provide better services to our users. This falls into two categories:
        </p>
        
        <div className="bg-[#FAF9F6] dark:bg-white/5 p-6 rounded-2xl border border-stone-100 dark:border-white/5">
            <h3 className="font-bold text-[#AB462F] uppercase text-xs tracking-widest mb-2">A. Information You Provide to Us</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">We collect information that you voluntarily provide when you register for an account, purchase products, subscribe to newsletters, or contact support.</p>
            <p className="mt-2 text-xs italic text-stone-500">This generally includes your name, email address, phone number, postal address, and payment information.</p>
        </div>

        <div className="bg-[#FAF9F6] dark:bg-white/5 p-6 rounded-2xl border border-stone-100 dark:border-white/5">
            <h3 className="font-bold text-[#AB462F] uppercase text-xs tracking-widest mb-2">B. Information Collected Automatically</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">
                When you navigate our Site, we gather information about your equipment and browsing actions using technologies like cookies.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-stone-600 dark:text-stone-300 marker:text-[#AB462F]">
                <li>Device Information: IP address, browser type, operating system.</li>
                <li>Usage Data: Pages visited, time spent on the site, and clickstream data.</li>
            </ul>
        </div>
      </div>
    )
  },
  {
    title: "Cookies and Tracking Technologies",
    icon: Code,
    content: (
      <p className="text-sm leading-loose">
        We use cookies, web beacons, and similar technologies to analyze trends, administer the website, and track users' movements around the Site. You can control the use of cookies at the individual browser level.
        <br/><br/>
        We may use third-party services (such as Google Analytics) that use cookies to help us analyze how users use the Site.
      </p>
    )
  },
  {
    title: "How We Use Your Information",
    icon: EyeOff,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
            <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Service Delivery</span>
            To process transactions, fulfill orders, and manage your account.
        </div>
        <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
            <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Communication</span>
            To send you order confirmations, updates, security alerts, and support messages.
        </div>
        <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
            <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Marketing</span>
            To inform you about new products, special offers, or events (with consent).
        </div>
        <div className="bg-[#FAF9F6] dark:bg-white/5 p-4 rounded-md">
            <span className="block font-bold text-xs uppercase tracking-wider mb-1 text-[#AB462F]">Improvement & Compliance</span>
            To understand user behavior, improve functionality, and comply with legal processes.
        </div>
      </div>
    )
  },
  {
    title: "Sharing Your Information",
    icon: ShieldAlert,
    content: (
      <>
        <p className="mb-4">
          We do not sell, trade, or rent your personal identification information to others. We may share information with:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-stone-600 dark:text-stone-300 marker:text-[#AB462F]">
            <li>Service Providers: Trusted third parties who assist us in operating our website (e.g., payment processors, shipping companies).</li>
            <li>Legal Requirements: If required to do so by law or in response to valid requests by public authorities.</li>
            <li>Business Transfers: If MIA is involved in a merger or sale, your information may be transferred as part of that transaction.</li>
        </ul>
      </>
    )
  },
  {
    title: "Data Security",
    icon: Lock,
    content: (
      <>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We use Secure Socket Layer (SSL) technology to encrypt sensitive information.
        </p>
        <p className="mt-4 bg-red-50 dark:bg-red-900/10 p-4 border-l-2 border-red-400 text-sm text-stone-600 dark:text-stone-400">
          However, no method of transmission over the internet or method of electronic storage is 100% secure.
        </p>
      </>
    )
  },
  {
    title: "Your Rights and Choices",
    icon: Globe,
    content: (
      <p>
        You may have specific rights regarding your personal data, including the right to request access, correction, or deletion of your data. You may also unsubscribe from our marketing emails at any time.
      </p>
    )
  },
]

export default function PrivacyPage() {
  return (
    <div className="w-full bg-transparent text-foreground font-sans pt-32 pb-32 selection:bg-[#AB462F] selection:text-white">
      
      {/* --- Header Section (Matched Terms of Service Aesthetic) --- */}
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
            Privacy <br/> <span className="font-serif italic font-normal lowercase tracking-normal text-stone-400 dark:text-stone-500">policy</span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 font-light max-w-lg mx-auto leading-relaxed">
            The rules of engagement. Please read these terms carefully before accessing or using our services.
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mt-4">
            Last Updated: November 15, 2022
          </p>
        </motion.div>
      </div>

      {/* --- Main Document Container --- */}
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <div className="relative">
            
            {/* Sticky "Last Updated" Badge (Optional but good for aesthetic consistency) */}
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